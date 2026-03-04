<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: number | null;
    placeholder?: string;
    min?: number;
    max?: number;
    maxLength?: number;
    isError?: boolean;
    errorMessage?: string;
    centered?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number | null): void;
  }>();

  const inputValue = ref<string>('');

  watch(() => props.modelValue, (newValue) => {
    if (newValue !== null && newValue !== undefined && !isNaN(newValue)) {
      inputValue.value = String(newValue);
    } else {
      inputValue.value = '';
    }
  }, { immediate: true });

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    value = value.replace(/\D/g, '');

    inputValue.value = value;
    target.value = value;

    let numericValue: number | null = null;
    if (value !== '') {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        numericValue = parsed;
      }
    }

    emit('update:modelValue', numericValue);
  }

  function onBlur() {
    let valueToEmit: number | null = null;
    if (inputValue.value !== '') {
      const parsed = parseInt(inputValue.value, 10);
      if (!isNaN(parsed)) {
        valueToEmit = parsed;
        if (props.min !== undefined && valueToEmit < props.min) {
          valueToEmit = props.min;
        }
        if (props.max !== undefined && valueToEmit > props.max) {
          valueToEmit = props.max;
        }
      }
    }

    if (valueToEmit !== null && String(valueToEmit) !== inputValue.value) {
      inputValue.value = String(valueToEmit);
    } else if (valueToEmit === null && inputValue.value !== '') {
      inputValue.value = '';
    }

    emit('update:modelValue', valueToEmit);
  }
</script>

<template>
  <div>
    <input
      type="text"
      :value="inputValue"
      @input="onInput"
      @blur="onBlur"
      :placeholder="placeholder"
      :maxlength="maxLength"
      inputmode="numeric"
      class="w-full px-4 py-3 border rounded-xl
      focus:outline-none md:text-[24px] text-[22px]
      transition border-gray-300 focus:border-primary"
      :class="{
        'border-red-500 focus:border-red-500': props.isError,
        'text-center': props.centered
      }"
    >
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
