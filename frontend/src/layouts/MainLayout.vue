<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
   

    <div class="flex-1 flex flex-col">

     <AppSidebar />

      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>

    </div>

  </div>
</template>

<script setup>
import { RouterView } from "vue-router";

import AppSidebar from "@/components/layout/AppSidebar.vue";
import AppHeader from "@/components/layout/AppHeader.vue";
</script>