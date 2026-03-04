<script setup lang="ts">
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import type { Component } from "vue";

  interface Props {
    isLoading?: boolean;
    label?: string;
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
      'p-4 w-full text-white rounded-xl transition font-semibold',
      'flex items-center justify-center gap-2',
      'md:text-md text-sm',
      props.isLoading || props.disabled
        ? 'bg-primary/50 hover:bg-primary/50 cursor-default'
        : 'bg-primary hover:bg-primary-light hover:shadow-md shadow-primary/50 active:scale-97 cursor-pointer'
    ]"
    @click="handleClick"
    :disabled="props.isLoading || props.disabled"
  >
    <template v-if="props.isLoading">
      <LoadingSpinner class="text-white"/>
    </template>

    <template v-else>
      <component
        v-if="icon"
        :is="icon"
        class="w-3 h-3 sm:w-5 sm:h-5"
      />
      {{ label }}
    </template>
  </button>
</template>