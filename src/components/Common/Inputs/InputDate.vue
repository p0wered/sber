<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: string;
    label: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input'): void;
    (e: 'blur'): void;
  }>();

  const localValue = ref(formatDate(props.modelValue ?? ''));

  watch(
    () => props.modelValue,
    (val) => {
      const formatted = formatDate(val ?? '');

      if (formatted !== localValue.value) {
        localValue.value = formatted;
      }

      if ((val ?? '') !== formatted) {
        emit('update:modelValue', formatted);
      }
    }
  );

  function formatDate(value: string | undefined | null): string {
    if (!value) return '';
    const digits = String(value).replace(/\D+/g, '').slice(0, 8);
    const parts: string[] = [];
    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length >= 3) parts.push(digits.slice(2, 4));
    if (digits.length >= 5) parts.push(digits.slice(4, 8));
    return parts.join('-');
  }

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const formatted = formatDate(target.value);
    localValue.value = formatted;
    emit('update:modelValue', formatted);
    emit('input');
  }
  
  function onBlur() {
    emit('blur');
  }

  function onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End'
    ];
    
    if (allowedKeys.includes(event.key)) {
      return;
    }
    
    if (event.ctrlKey && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }
    
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
</script>

<template>
  <div>
    <div class="relative">
      <input
        id="date-input"
        type="text"
        inputmode="numeric"
        :value="localValue"
        maxlength="10"
        placeholder="ДД-ММ-ГГГГ"
        @input="onInput"
        @blur="onBlur"
        @keydown="onKeyDown"
        class="peer w-full px-4 py-3 mt-5 border rounded-md focus:outline-none
        md:text-[18px] text-[16px] transition-all bg-secondary focus:bg-white
        placeholder-transparent focus:placeholder-gray-400 focus:shadow-md"
        :class="[
          props.isError
            ? 'border-red-500 focus:border-red-500'
            : 'border-transparent focus:border-primary'
        ]"
      >
      <label
        for="date-input"
        class="absolute left-0 transition-all duration-200 origin-top-left
        text-[16px] md:text-[18px]
        text-gray-500 peer-focus:text-primary pointer-events-none
        top-[-5%] peer-focus:top-[-5%] peer-placeholder-shown:top-[47%]
        scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100
        pl-2 peer-focus:pl-2 peer-placeholder-shown:pl-4">
        {{ label }}
      </label>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
