<template>
  <div class="flex flex-col h-screen">
    <AdminHeader />
   

    <div class="flex-1 flex flex-col">

     <AdminSidebar />

      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>

    </div>

  </div>
</template>

<script setup>
import { RouterView } from "vue-router";

import AdminSidebar from "@/components/admin/layout/AdminSidebar.vue";
import AdminHeader from "@/components/admin/layout/AdminHeader.vue";
</script>