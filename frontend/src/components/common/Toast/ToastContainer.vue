<template>
  <div
    class="fixed top-4 right-18  z-50 flex flex-col gap-2 pointer-events-none"
  >
    <Toast
      v-for="t in toastState.toasts"
      :key="t.id"
      :id="t.id"
      :type="t.type"
      :message="t.message"
      :duration="t.duration"
    />
  </div>
</template>

<script>
import Toast from "./Toast.vue";
import { toastState } from "@/composables/toast.composable";

export default {
  name: "ToastContainer",

  components: {
    Toast,
  },

  data() {
    return {
      toastState,
    };
  },
};
</script>