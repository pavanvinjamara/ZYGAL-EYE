<!-- Header.vue -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

import { useAppStore } from "@/stores/store";
import { useAuthStore } from "@/stores/auth.store";
import { toggleThemeWithWave } from "@/utils/theme.util";
import { computed } from "vue";
const router = useRouter();

const appStore = useAppStore();
const authStore = useAuthStore();

const hasAlerts = ref(true); // wire to real SLA-breach state
const clock = ref("--:--:--");
let clockTimer = null;

function updateClock() {
  clock.value = new Date().toLocaleTimeString("en-IN", { hour12: false }) + " IST";
}

function toggleTheme(event) {
  const nextTheme = toggleThemeWithWave(appStore.theme, event);
  appStore.setTheme(nextTheme);
}

async function logout() {
  try {
    await authStore.logout();
  } finally {
    router.replace("/vendor/login");
  }
}



const user = computed(() => authStore.user);
console.log(user);
const userInitials = computed(() => {
  if (!user.value?.name) return "NA";

  return user.value.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
});

onMounted(() => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);
});

onBeforeUnmount(() => {
  clearInterval(clockTimer);
});
</script>

<template>
  <header class="h-[52px] bg-slate-800 flex items-center px-5 gap-4 shrink-0 z-[100]">
    <!-- Logo -->
    <div class="flex items-center gap-2.5">
      <div class="w-[30px] h-[30px] bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="12" rx="11" ry="7" stroke="white" stroke-width="1.8" />
          <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
      </div>
      <div>
        <div class="font-mono text-[13px] font-bold text-white tracking-wider leading-none">
          IIFL EYE
        </div>
        <div class="text-[9px] text-white/40 tracking-wide leading-tight mt-0.5">
          Vendor Portal
        </div>
      </div>
    </div>

    <div class="w-px h-5 bg-white/10"></div>

    <!-- Vendor chip -->
    <div class="flex items-center gap-2 bg-white/[0.08] border border-white/10 rounded-md py-1 pl-1 pr-3">
     <div
        class="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center font-mono text-[10px] font-bold text-white bg-orange-600 shrink-0"
      >
        {{ userInitials }}
      </div>

      <div>
        <div class="text-xs font-semibold text-white leading-none">
          {{ user?.name || "Guest" }}
        </div>

        <div class="text-[10px] text-white/45 leading-tight mt-0.5">
          {{ user?.role?.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase()) }}
        </div>
      </div>
    </div>

    <!-- Right side -->
    <div class="ml-auto flex items-center gap-3">
      <button
        @click="toggleTheme"
        title="Toggle theme"
        class="w-7 h-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-[13px] cursor-pointer hover:bg-white/10 transition"
      >
        <span v-if="appStore.isDark">☀️</span>
        <span v-else>🌙</span>
      </button>

      <div class="relative cursor-pointer" title="Notifications">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2a5.5 5.5 0 015.5 5.5c0 2.8.7 4.2 1.4 5H2.1c.7-.8 1.4-2.2 1.4-5A5.5 5.5 0 019 2zM7.5 15a1.5 1.5 0 003 0"
            stroke="rgba(255,255,255,0.5)"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
        <div
          v-if="hasAlerts"
          class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-600 border-2 border-slate-800"
        ></div>
      </div>

      <div class="font-mono text-[11px] text-white/40">{{ clock }}</div>

      <div
        @click="logout"
        class="text-[11px] text-white/40 cursor-pointer px-2 py-1 rounded border border-white/10 transition-all hover:text-white hover:border-white/30"
      >
        Sign Out
      </div>
    </div>
  </header>
</template>