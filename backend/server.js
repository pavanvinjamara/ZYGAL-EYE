const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./src/config/db");

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Health Check
 */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Vendor Portal API Running"
    });
});

/**
 * Routes
 */
app.use("/api/v1", require("./src/routes"));

/**
 * Start Server
 */
async function startServer() {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log("====================================");
            console.log("🚀 Vendor Portal API Started");
            console.log(`🌐 Port : ${PORT}`);
            console.log("====================================");
        });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB");
        console.error(error);
        process.exit(1);
    }
}

startServer();