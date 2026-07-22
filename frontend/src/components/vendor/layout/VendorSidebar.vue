<!-- Sidebar.vue -->
<script setup>
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

// wire these to real store values when available
const openTicketCount = 4;
const misPending = true; // shows "NEW" badge like the HTML
const penaltyCount = 2;
const sopOpenCount = 3;
const slaScore = 97.2;

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", to: "/", icon: "dashboard" },
      { title: "My Tickets", to: "/tickets", icon: "tickets", countKey: "tickets" },
      { title: "MIS Upload", to: "/mis", icon: "mis", countKey: "mis" },
    ],
  },
  {
    label: "Performance",
    items: [
      { title: "SLA Tracker", to: "/sla", icon: "sla" },
      { title: "Penalties", to: "/penalties", icon: "penalties", countKey: "penalties" },
      { title: "SOP Adherence", to: "/sop", icon: "sop", countKey: "sop" },
      { title: "Service Reports", to: "/reports", icon: "reports" },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "My Profile", to: "/profile", icon: "profile" },
      { title: "Contact IIFL", to: "/contact", icon: "contact" },
    ],
  },
];

function isActive(path) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function countFor(item) {
  if (item.countKey === "tickets") return openTicketCount;
  if (item.countKey === "penalties") return penaltyCount;
  if (item.countKey === "sop") return sopOpenCount;
  return null;
}

function slaColorClass(v) {
  if (v >= 97) return "text-emerald-600";
  if (v >= 93) return "text-amber-600";
  return "text-red-600";
}

function slaBarClass(v) {
  if (v >= 97) return "bg-emerald-600";
  if (v >= 93) return "bg-amber-600";
  return "bg-red-600";
}
</script>

<template>
  <nav class="w-[200px] bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
    <template v-for="group in navGroups" :key="group.label">
      <div class="text-[9px] font-bold tracking-widest uppercase text-slate-400 px-4 pt-4 pb-1">
        {{ group.label }}
      </div>

      <RouterLink
        v-for="item in group.items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2.5 px-4 py-2 text-[13px] border-l-[3px] transition-all no-underline"
        :class="
          isActive(item.to)
            ? 'bg-orange-50 text-orange-600 border-orange-600 font-semibold'
            : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
        "
      >
        <!-- Dashboard -->
        <svg
          v-if="item.icon === 'dashboard'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8" />
        </svg>

        <!-- Tickets -->
        <svg
          v-else-if="item.icon === 'tickets'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3" />
          <path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>

        <!-- MIS Upload -->
        <svg
          v-else-if="item.icon === 'mis'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect x="2" y="1" width="9" height="11" rx="1" stroke="currentColor" stroke-width="1.3" />
          <path d="M5 4h4M5 7h4M5 10h2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2" />
          <path d="M11 12h2M12 11v2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" />
        </svg>

        <!-- SLA Tracker -->
        <svg
          v-else-if="item.icon === 'sla'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3" />
          <path d="M8 4V8L11 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>

        <!-- Penalties -->
        <svg
          v-else-if="item.icon === 'penalties'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 1L10 6H15L11 9.5L12.5 14.5L8 11.5L3.5 14.5L5 9.5L1 6H6L8 1Z"
            stroke="currentColor"
            stroke-width="1.2"
          />
        </svg>

        <!-- SOP Adherence -->
        <svg
          v-else-if="item.icon === 'sop'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M2 3h12M2 6h8M2 9h10M2 12h6"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
          />
          <circle cx="13" cy="11" r="2.5" stroke="currentColor" stroke-width="1.2" />
          <path d="M12.2 11l.6.6 1.2-1.2" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
        </svg>

        <!-- Service Reports -->
        <svg
          v-else-if="item.icon === 'reports'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M2 12L5 7l3 3 3-5 3 5"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <rect x="1" y="1" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="1.3" />
        </svg>

        <!-- Profile -->
        <svg
          v-else-if="item.icon === 'profile'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="8" cy="6" r="3" stroke="currentColor" stroke-width="1.3" />
          <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
        </svg>

        <!-- Contact -->
        <svg
          v-else-if="item.icon === 'contact'"
          class="w-[15px] h-[15px] shrink-0"
          :class="isActive(item.to) ? 'opacity-100' : 'opacity-65'"
          viewBox="0 0 16 16"
          fill="none"
        >
          <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3" />
          <path d="M1 5l7 5 7-5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
        </svg>

        <span>{{ item.title }}</span>

        <!-- Count badges -->
        <span
          v-if="item.countKey === 'tickets' && countFor(item) > 0"
          class="ml-auto font-mono text-[10px] font-bold px-[5px] py-px rounded-full min-w-[18px] text-center bg-red-600 text-white"
        >
          {{ countFor(item) }}
        </span>

        <span
          v-if="item.countKey === 'mis' && misPending"
          class="ml-auto font-mono text-[10px] font-bold px-[5px] py-px rounded-full min-w-[18px] text-center bg-emerald-600 text-white"
        >
          NEW
        </span>

        <span
          v-if="item.countKey === 'penalties' && countFor(item) > 0"
          class="ml-auto font-mono text-[10px] font-bold px-[5px] py-px rounded-full min-w-[18px] text-center bg-amber-600 text-white"
        >
          {{ countFor(item) }}
        </span>

        <span
          v-if="item.countKey === 'sop' && countFor(item) > 0"
          class="ml-auto font-mono text-[10px] font-bold px-[5px] py-px rounded-full min-w-[18px] text-center bg-violet-600 text-white"
        >
          {{ countFor(item) }}
        </span>
      </RouterLink>
    </template>

    <!-- Footer -->
    <div class="mt-auto p-4 border-t border-slate-200">
      <div class="bg-slate-50 rounded-[7px] px-3 py-2.5">
        <div class="text-[9px] font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
          SLA Score
        </div>
        <div class="font-mono text-[22px] font-bold leading-none" :class="slaColorClass(slaScore)">
          {{ slaScore }}%
        </div>
        <div class="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="slaBarClass(slaScore)"
            :style="{ width: slaScore + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </nav>
</template>