<script setup lang="ts">
  import { Check } from "lucide-vue-next";
</script>

<template>
  <div class="w-full h-14 flex justify-center items-center gap-2 bg-green-700/20 rounded-lg mb-6">
    <div class="p-1 bg-green-700 rounded-full">
      <Check class="w-4 h-4 text-white"/>
    </div>
    <p class="text-green-700 font-semibold leading-0 md:text-lg text-sm">
      Ваша заявка одобрена
    </p>
  </div>
</template>
