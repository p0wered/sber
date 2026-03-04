<script setup lang="ts">
  import { CloudAlert } from "lucide-vue-next";

  const props = defineProps<{
    error: string;
  }>();
</script>

<template>
  <div class="flex flex-col gap-1 justify-center items-center text-center text-red-600 py-20">
    <CloudAlert
      class="w-10 h-10 md:w-14 md:h-14"
      :stroke-width="1"
    />
    <p class="text-[16px] md:text-[20px]">
      {{ props.error }}
    </p>
  </div>
</template>