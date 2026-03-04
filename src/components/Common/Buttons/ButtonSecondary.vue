<script setup lang="ts">
  interface Props {
    isLoading?: boolean;
    label?: string;
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
      'text-black/40 rounded-lg transition md:text-md text-sm',
      props.isLoading
        ? 'cursor-default'
        : 'cursor-pointer hover:text-black/60'
    ]"
    @click="handleClick"
    :disabled="props.isLoading"
  >
    {{ label }}
  </button>
</template>
