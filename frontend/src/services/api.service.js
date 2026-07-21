const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

class ApiService {
    constructor() {
        this.controllers = new Map();
    }

    abort(key) {
        const controller = this.controllers.get(key);
        if (controller) {
            controller.abort();
            this.controllers.delete(key);
        }
    }

    abortAll() {
        this.controllers.forEach(controller => controller.abort());
        this.controllers.clear();
    }

    async get(url, options = {}) {
        return this.request("GET", url, null, options);
    }

    async post(url, body, options = {}) {
        return this.request("POST", url, body, options);
    }

    async put(url, body, options = {}) {
        return this.request("PUT", url, body, options);
    }

    async delete(url, options = {}) {
        return this.request("DELETE", url, null, options);
    }

    async request(method, url, body = null, options = {}) {
        const key = options.key || `${method}:${url}`;

        this.abort(key);

        const controller = new AbortController();
        this.controllers.set(key, controller);

        const timeout = options.timeout || 30000;
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, timeout);

        try {
            const response = await fetch(API_BASE_URL + url, {
                method,
                signal: controller.signal,
                credentials: "include", // required: refresh token travels as an httpOnly cookie
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                },
                body: body ? JSON.stringify(body) : null
            });

            clearTimeout(timeoutId);
            this.controllers.delete(key);

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const message = data?.message || `HTTP ${response.status}`;
                const error = new Error(message);
                error.status = response.status;
                error.errors = data?.errors;
                throw error;
            }

            return data;

        } catch (err) {
            clearTimeout(timeoutId);
            this.controllers.delete(key);

            if (err.name === "AbortError") {
                console.log(`${key} cancelled`);
            }

            throw err;
        }
    }

    // ---------------- auth endpoints ----------------
    // Server contract: { success, message, data: { user, accessToken } } on login/refresh
    // Refresh token itself is never in the JSON body — it travels as an httpOnly cookie.

    // async signup(userData) {
    //     // { name, email, password } -> { success, data: { id, name, email } }
    //     return this.post("/auth/signup", userData);
    // }

    async login(credentials) {
        // { email, password } -> { success, data: { user, accessToken } }
        return this.post("/auth/login", credentials);
    }

    async refresh() {
        // No body needed - refresh token cookie is sent automatically via credentials:'include'
        return this.post("/auth/refresh", null);
    }

    async logout(accessToken) {
        return this.post("/auth/logout", null, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
    }

    // ---------------- vendor endpoints ----------------
    async getPublicVendors() {
        // -> { success, vendors: [{ value, label, shortCode }] }
        return this.get("/vendors/public", { key: "vendors:public" });
    }
}

export default new ApiService();