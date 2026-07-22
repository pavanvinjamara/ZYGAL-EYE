<template>
  <div class="flex flex-col h-screen">
    <VendorHeader />
   

    <div class="flex-1 flex flex-col">

     <VendorSidebar />

      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>

    </div>

  </div>
</template>

<script setup>
import { RouterView } from "vue-router";

import VendorSidebar from "@/components/vendor/layout/VendorSidebar.vue";
import VendorHeader from "@/components/vendor/layout/VendorHeader.vue";
</script>