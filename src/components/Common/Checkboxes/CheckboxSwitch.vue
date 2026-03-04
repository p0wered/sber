<script setup lang="ts">
  import { defineEmits, defineProps } from 'vue';

  const props = defineProps<{
    id?: string;
    modelValue: boolean;
  }>();

  const emit = defineEmits(['update:modelValue']);

  const toggle = () => emit('update:modelValue', !props.modelValue);
</script>

<template>
  <button
    type="button"
    :id="id"
    role="switch"
    :aria-checked="modelValue"
    class="inline-flex h-[20px] w-8 shrink-0 items-center rounded-full text-black
    border border-transparent shadow-xs transition-all outline-none justify-self-end cursor-pointer"
    :class="modelValue ? 'bg-primary' : 'bg-neutral-200'"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
  >
    <span
      class="block h-4 w-4 rounded-full bg-white transition-transform"
      :class="modelValue ? 'translate-x-[calc(100%-3px)]' : 'translate-x-[2px]'"
    />
  </button>
</template>
