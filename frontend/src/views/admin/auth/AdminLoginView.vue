<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "@/composables/toast.composable";

import { useAppStore } from "../../../stores/store.js";
import { useAuthStore } from "../../../stores/auth.store.js";
import { toggleThemeWithWave } from "../../../utils/theme.util.js";
import apiService from "@/services/api.service";

const router = useRouter();

const appStore = useAppStore();
const authStore = useAuthStore();



const email = ref("");
const password = ref("");

const showPassword = ref(false);
const isSubmitting = ref(false);

const isDark = computed(() => appStore.isDark);

onMounted(async () => {
 
});

function handleThemeToggle(event) {
  const nextTheme = toggleThemeWithWave(appStore.theme, event);
  appStore.setTheme(nextTheme);
}

function validate() {
  if (!email.value) return "Please enter your email.";
  if (!password.value) return "Please enter your password.";

  return "";
}

async function handleSubmit() {
  const validationError = validate();

  if (validationError) {
    showToast({
      type: "warning",
      message: validationError,
    });
    return;
  }

  isSubmitting.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

   console.log("=====", router);

    router.push({
      name: "Dashboard",
    });

     showToast({
      type: "success",
      message: "Login successful.",
    });

  } catch (err) {
  console.log(err, "errr");
    showToast({
      type: "error",
      message:
        err.errors?.[0]?.msg ||
        err.message ||
        "Sign in failed. Please check your credentials.",
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center overflow-hidden relative bg-[var(--login-from)]">

    <div
      class="absolute inset-0"
      style="background: linear-gradient(135deg, var(--login-from) 0%, var(--login-via) 50%, var(--login-to) 100%);"
    ></div>
    <div
      class="absolute inset-0"
      style="background: radial-gradient(ellipse at 30% 50%, rgba(234,88,12,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(8,145,178,0.06) 0%, transparent 50%);"
    ></div>
    <div
      class="absolute inset-0"
      :style="{
        backgroundImage: `linear-gradient(rgba(255,255,255,var(--login-grid-opacity)) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,var(--login-grid-opacity)) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }"
    ></div>

    <button
      type="button"
      class="absolute top-5 right-5 z-20 w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer
             bg-white/10 border border-white/15 text-white/75 hover:bg-white/20 hover:text-white
             transition-colors"
      :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
      @click="handleThemeToggle"
    >
      <svg v-if="isDark" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.4"/>
        <path d="M8 1v1.5M8 13.5V15M15 8h-1.5M2.5 8H1M12.6 3.4l-1 1M4.4 11.6l-1 1M12.6 12.6l-1-1M4.4 4.4l-1-1"
              stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 9.5A6 6 0 016.5 2.5 6 6 0 1013.5 9.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="relative z-10 w-[420px] mx-auto rounded-2xl p-10 bg-[var(--card)] shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)]">

      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-5">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--accent)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="12" rx="11" ry="7" stroke="white" stroke-width="1.8"/>
              <circle cx="12" cy="12" r="4" fill="white" opacity="0.3"/>
              <circle cx="12" cy="12" r="2.5" fill="white"/>
              <circle cx="13" cy="11" r="0.8" fill="rgba(234,88,12,0.7)"/>
            </svg>
          </div>
          <div class="text-left">
            <div class="font-mono text-lg font-bold tracking-wide text-[var(--text)]">IIFL EYE</div>
            <div class="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">Admin Portal</div>
          </div>
        </div>
        <div class="text-xl font-bold text-[var(--text)] mb-1">Admin Sign In</div>
        <div class="text-[13px] text-[var(--text-muted)]">Access system administration, monitoring &amp; vendor management</div>
      </div>

      <form novalidate @submit.prevent="handleSubmit">


        <div class="mb-4">
          <label for="login-email" class="block text-xs font-semibold tracking-wide mb-1.5 text-[var(--text-secondary)]">
           Administrator Email
          </label>
          <input
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="you@yourcompany.in"
            class="w-full px-3.5 py-2.5 rounded-md text-sm outline-none
                   bg-[var(--input)] text-[var(--text)] border border-[var(--border)]
                   focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]
                   transition-colors"
          >
        </div>

        <div class="mb-4">
          <label for="login-password" class="block text-xs font-semibold tracking-wide mb-1.5 text-[var(--text-secondary)]">
            Password
          </label>
          <div class="relative">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full pl-3.5 pr-14 py-2.5 rounded-md text-sm outline-none
                     bg-[var(--input)] text-[var(--text)] border border-[var(--border)]
                     focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]
                     transition-colors"
            >
            <button
              type="button"
              class="absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] font-semibold
                     text-[var(--text-muted)] hover:text-[var(--accent)] px-1.5 py-1"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full mt-2 py-3 rounded-md text-sm font-semibold tracking-wide text-white
                 bg-[var(--accent)] hover:bg-[var(--accent-hover)] hover:-translate-y-px
                 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                 transition-all shadow-[0_4px_12px_rgba(234,88,12,0)] hover:shadow-[0_4px_12px_rgba(234,88,12,0.35)]"
        >
          {{ isSubmitting ? "Signing in…" : "Sign In to Admin Portal" }}
        </button>
      </form>

      <div class="flex items-center gap-2.5 my-5 text-[11px] text-[var(--text-muted)]">
        <span class="flex-1 h-px bg-[--border]"></span>
        Secured by IIFL EYE SOC
        <span class="flex-1 h-px bg-[--border]"></span>
      </div>

      <div class="text-center text-[11px] leading-relaxed text-[var(--text-muted)]">
        For administrator access, contact the System Administrator<br>
        or email <strong class="text-[var(--text-secondary)]">eye-support&#64;iifl.com</strong>
      </div>
    </div>
  </div>
</template>