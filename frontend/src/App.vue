<script setup>
import { RouterView } from "vue-router";
import ToastContainer from "@/components/common/Toast/ToastContainer.vue";
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
}
</style>