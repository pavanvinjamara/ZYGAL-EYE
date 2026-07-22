<!--
  AdminHeader.vue
  Tailwind port of the ".status-bar" from iifl-eye-admin.html.
  Same 44px height, teal (#0891B2) brand, heartbeat pulse, live stats, clock, user chip.
-->
<template>
  <header
    class="flex h-11 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
  >
    <!-- LEFT: brand + heartbeat + system status -->
    <div class="flex items-center gap-6">
      <!-- Brand -->
      <div class="flex items-center gap-2.5">
        <div class="h-7 w-7 shrink-0 text-[#0891B2]">
          <!-- Replace with <img :src="logoUrl" /> if you have a raster/SVG logo asset -->
          <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7">
            <circle cx="14" cy="14" r="12" stroke="currentColor" stroke-width="1.6" />
            <path
              d="M4 14C4 14 8 8 14 8C20 8 24 14 24 14C24 14 20 20 14 20C8 20 4 14 4 14Z"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <circle cx="14" cy="14" r="3.4" fill="currentColor" />
          </svg>
        </div>

        <div class="h-6 w-px bg-slate-200"></div>

        <div>
          <div class="font-mono text-sm font-semibold tracking-[0.12em] text-[#0891B2]">
            EYE SOC
          </div>
          <div class="text-[10px] uppercase tracking-[0.08em] text-slate-400">
            Central Security Operations
          </div>
        </div>
      </div>

      <!-- Heartbeat -->
      <div class="flex items-center gap-2">
        <span class="font-mono text-[10px] tracking-[0.06em] text-slate-400">NETWORK</span>
        <svg class="h-6 w-[120px]" viewBox="0 0 120 24" xmlns="http://www.w3.org/2000/svg">
          <path
            class="stroke-[#0891B2]"
            fill="none"
            stroke-width="1.5"
            d="M0,12 L20,12 L24,12 L28,4 L32,20 L36,8 L40,16 L44,12 L60,12 L64,12 L68,6 L72,18 L76,9 L80,15 L84,12 L100,12 L104,12 L108,5 L112,19 L116,10 L120,12"
          />
        </svg>
      </div>

      <!-- System OK pulse -->
      <div class="flex items-center gap-1.5 font-mono text-[11px] text-emerald-600">
        <span class="relative flex h-[7px] w-[7px]">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60"
          ></span>
          <span class="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-500"></span>
        </span>
        {{ systemStatusLabel }}
      </div>
    </div>

    <!-- RIGHT: KPI stats + clock + user -->
    <div class="flex items-center gap-5">
      <template v-for="(stat, i) in stats" :key="stat.label">
        <div class="flex flex-col items-end">
          <span
            class="font-mono text-[13px] font-semibold"
            :class="{
              'text-slate-900': !stat.tone,
              'text-amber-600': stat.tone === 'warn',
              'text-red-600': stat.tone === 'crit',
            }"
          >
            {{ stat.value }}
          </span>
          <span class="text-[9px] uppercase tracking-[0.07em] text-slate-400">
            {{ stat.label }}
          </span>
        </div>
        <div class="h-6 w-px bg-slate-200"></div>
      </template>

      <div class="font-mono text-xs text-slate-600">{{ clock }}</div>
      <div class="h-6 w-px bg-slate-200"></div>

      <!-- User chip -->
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 py-[3px] pl-1.5 pr-2.5 hover:bg-slate-100"
        @click="$emit('open-profile-menu')"
      >
        <div
          class="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-sky-100 font-mono text-[9px] font-semibold text-[#0891B2]"
        >
          {{ initials }}
        </div>
        <span class="text-[11px] text-slate-600">{{ userName }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  userName: { type: String, default: 'Sumanyu M.' },
  systemStatusLabel: { type: String, default: 'ALL SYSTEMS OPERATIONAL' },
  // Pass live values from a store/API; these mirror the four sb-stat blocks
  // in the original markup (Total Branches / Uptime / Open Tickets / SLA Breaches).
  stats: {
    type: Array,
    default: () => [
      { label: 'Total Branches', value: '44,020' },
      { label: 'Network Uptime', value: '98.3%' },
      { label: 'Open Tickets', value: '139', tone: 'warn' },
      { label: 'SLA Breaches', value: '7', tone: 'crit' },
    ],
  },
});

defineEmits(['open-profile-menu']);

const initials = computed(() =>
  props.userName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
);

const clock = ref('--:--:--');
let timer = null;

function tick() {
  clock.value = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

onMounted(() => {
  tick();
  timer = setInterval(tick, 1000);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>