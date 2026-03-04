<script setup lang="ts">
  import type { Component } from "vue";

  interface Props {
    isLoading?: boolean;
    icon?: Component;
    disabled?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: 'click'): void;
  }>();

  function handleClick() {
    if (!props.isLoading) {
      emit('click');
    }
  }
</script>

<template>
  <button
    :class="[
      'p-4 text-white rounded-lg transition font-semibold',
      'flex items-center justify-center gap-2 border border-gray-200',
      'md:text-base text-sm bg-secondary',
      props.isLoading || props.disabled
        ? 'cursor-default'
        : 'hover:bg-secondary-dark active:scale-97 cursor-pointer'
    ]"
    @click="handleClick"
    :disabled="props.isLoading || props.disabled"
  >
    <component
      v-if="icon"
      :is="icon"
      class="text-primary w-4 h-4 sm:w-6 sm:h-6"
    />
  </button>
</template>