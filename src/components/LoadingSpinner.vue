<script setup lang="ts">
  import { useAttrs } from 'vue';

  interface Props {
    size?: string; }

  const props = withDefaults(defineProps<Props>(), {
    size: '24px'
  });

  const attrs = useAttrs();
</script>

<template>
  <div class="w-full flex justify-center">
    <div
      class="simple-spinner block border-[3px] border-solid border-transparent rounded-full"
      :class="attrs.class"
      :style="{ width: props.size, height: props.size }"
      v-bind="attrs"
    />
  </div>
</template>

<style scoped>
  .simple-spinner{
    box-sizing: border-box;
    border-top-color: currentColor;
    border-right-color: currentColor;
    border-bottom-color: currentColor;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
