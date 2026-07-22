<!--
  AdminSidebar.vue
  Tailwind port of the ".sidebar" nav from iifl-eye-admin.html.
  Same 220px width, teal active state, section labels, badges, version footer.
  Uses <router-link> (with router-link-active styling) instead of onclick="switchSection".
-->
<template>
  <nav class="flex w-[220px] flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-[1px_0_0_#E2E8F0]">
    <template v-for="section in sections" :key="section.label">
      <div class="px-4 pb-1.5 pt-4 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        {{ section.label }}
      </div>

      <router-link
        v-for="item in section.items"
        :key="item.to"
        :to="item.to"
        class="group relative flex items-center gap-2.5 border-l-[3px] border-transparent px-4 py-[9px] text-[13px] text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-[#0891B2]"
        active-class="!border-[#0891B2] !bg-sky-100 !text-[#0891B2] font-medium"
      >
        <span class="h-4 w-4 shrink-0 opacity-70 group-hover:opacity-100" v-html="item.icon"></span>
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto min-w-[18px] rounded-full px-[5px] py-px text-center font-mono text-[9px] font-semibold text-white"
          :class="item.badgeTone === 'warn' ? 'bg-amber-600' : 'bg-red-600'"
        >
          {{ item.badge }}
        </span>
      </router-link>
    </template>

    <div class="mt-auto border-t border-slate-200 px-4 py-3">
      <div class="font-mono text-[9px] text-slate-400">{{ versionTag }}</div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  versionTag: { type: String, default: 'IIFL EYE v2.4.1 · Powered by Zygal MVS' },
});

// icon markup lifted 1:1 from the original <svg class="nav-icon"> elements
const icons = {
  dashboard:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/><rect x="9" y="1" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.8"/></svg>',
  health:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M4 8h2l1.5-3 2 6 1-3H12" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  ai:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2L10 6H14L11 9L12 13L8 11L4 13L5 9L2 6H6L8 2Z" stroke="currentColor" stroke-width="1.3"/></svg>',
  cameras:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M11 7L15 5V11L11 9" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  tickets:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  sla:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/><path d="M8 4V8L11 10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  vendors:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="6" r="2.5" stroke="currentColor" stroke-width="1.3"/><circle cx="11" cy="6" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M1 14c0-2.5 1.8-4 4-4s4 1.5 4 4M7 14c0-2.5 1.8-4 4-4s4 1.5 4 4" stroke="currentColor" stroke-width="1.2"/></svg>',
  onboarding:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  users:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="5" r="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" stroke-width="1.3"/><path d="M12 2v4M10 4h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  footage:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="11" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M12 7l3-2v6l-3-2V7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="5.5" cy="8" r="1.5" fill="currentColor" opacity=".4"/></svg>',
  ble:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v12M8 2l3 3-3 3 3 3-3 3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  exec:
    '<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L5 7l3 3 3-5 3 5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="1" width="14" height="14" rx="1.5" stroke="currentColor" stroke-width="1.3"/></svg>',
};

// Adjust `to` paths to match your actual admin.routes.js route paths/names.
const sections = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview Dashboard', to: '/admin', icon: icons.dashboard },
      { label: 'Health Dashboard', to: '/admin/health', icon: icons.health, badge: 14, badgeTone: 'warn' },
      { label: 'AI Monitoring', to: '/admin/ai', icon: icons.ai, badge: 3 },
      { label: 'Live Cameras', to: '/admin/cameras', icon: icons.cameras },
    ],
  },
  {
    label: 'Ticketing',
    items: [
      { label: 'D365 Service Requests', to: '/admin/tickets', icon: icons.tickets, badge: 139 },
      { label: 'SLA & Penalties', to: '/admin/sla', icon: icons.sla, badge: 7 },
    ],
  },
  {
    label: 'Vendors',
    items: [
      { label: 'Vendor Portal', to: '/admin/vendors', icon: icons.vendors },
      { label: 'Onboard Vendor', to: '/admin/onboarding', icon: icons.onboarding },
      { label: 'User Management', to: '/admin/users', icon: icons.users },
      { label: 'CCTV Footage', to: '/admin/footage', icon: icons.footage },
      { label: 'BLE Asset Tracking', to: '/admin/ble', icon: icons.ble },
    ],
  },
  {
    label: 'Reports',
    items: [{ label: 'Executive Dashboard', to: '/admin/exec', icon: icons.exec }],
  },
];
</script>