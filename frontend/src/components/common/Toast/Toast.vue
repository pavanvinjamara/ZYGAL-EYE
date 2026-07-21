<template>
  <div
    class="pointer-events-auto w-fit max-w-[560px] border-l-4 rounded-md shadow-md px-4 py-3 flex items-start gap-3 transform transition-all duration-300 ease-in-out"
    :class="[
      theme.bg,
      theme.border,
      visible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-6 opacity-0'
    ]"
  >
    <div
      class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-white"
      :class="theme.icon"
    >
      {{ theme.ring }}
    </div>

    <div class="flex-1 text-sm text-gray-800 leading-snug">
      {{ message }}
    </div>

    <button
      class="flex-shrink-0 text-gray-400 hover:text-gray-600 text-sm font-bold leading-none pt-0.5"
      @click="close"
    >
      ✕
    </button>
  </div>
</template>

<script>
import { removeToast } from "@/composables/toast.composable";

export default {
  name: "Toast",

  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000,
    },
  },

  data() {
    return {
      visible: false,
      timer: null,
    };
  },

  computed: {
    theme() {
      const map = {
        success: {
          bg: "bg-green-200",
          border: "border-green-500",
          icon: "text-green-500",
          ring: "✓",
        },
        error: {
          bg: "bg-red-200",
          border: "border-red-500",
          icon: "text-red-500",
          ring: "✕",
        },
        warning: {
          bg: "bg-yellow-200",
          border: "border-yellow-500",
          icon: "text-yellow-500",
          ring: "!",
        },
        info: {
          bg: "bg-blue-200",
          border: "border-blue-500",
          icon: "text-blue-500",
          ring: "i",
        },
      };

      return map[this.type] || map.info;
    },
  },

  mounted() {
    requestAnimationFrame(() => {
      this.visible = true;
    });

    this.timer = setTimeout(() => {
      this.close();
    }, this.duration);
  },

  beforeUnmount() {
    clearTimeout(this.timer);
  },

  methods: {
    close() {
      clearTimeout(this.timer);

      this.visible = false;

      setTimeout(() => {
        removeToast(this.id);
      }, 300);
    },
  },
};
</script>