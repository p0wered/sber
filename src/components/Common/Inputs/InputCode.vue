<script setup lang="ts">
  import { nextTick, ref } from 'vue';

  interface Props {
    length?: number
    modelValue?: string[]
    error?: string
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    length: 4,
    modelValue: () => [],
    error: '',
    disabled: false
  });

  const emit = defineEmits<{
    'update:modelValue': [value: string[]]
    'complete': [code: string]
  }>();

  const inputRefs = ref<HTMLInputElement[]>([]);

  const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
      inputRefs.value[index] = el;
    }
  };

  const handleInput = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    value = value.replace(/\D/g, '');

    if (value.length > 1) {
      value = value.charAt(0);
    }

    target.value = value;

    const newCode = [...props.modelValue];
    newCode[index] = value;

    emit('update:modelValue', newCode);

    if (value && index < props.length - 1) {
      nextTick(() => {
        inputRefs.value[index + 1]?.focus();
      });
    }

    if (newCode.every(digit => digit) && newCode.length === props.length) {
      emit('complete', newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent) => {
    if (!/^\d$/.test(event.key) &&
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      if (!props.modelValue[index] && index > 0) {
        inputRefs.value[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (event: ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const digits = pastedText.replace(/\D/g, '').slice(0, props.length);

    if (digits) {
      const newCode = Array.from({ length: props.length }, (_, i) => digits[i] || '');
      emit('update:modelValue', newCode);

      const nextEmptyIndex = newCode.findIndex(digit => !digit);
      const focusIndex = nextEmptyIndex === -1 ? props.length - 1 : nextEmptyIndex;

      nextTick(() => {
        inputRefs.value[focusIndex]?.focus();
      });

      if (newCode.every(digit => digit)) {
        emit('complete', newCode.join(''));
      }
    }
  };

  const focusFirst = () => {
    nextTick(() => {
      inputRefs.value[0]?.focus();
    });
  };

  defineExpose({
    focusFirst
  });
</script>

<template>
  <div class="space-y-3">
    <div class="flex justify-center gap-2 sm:gap-3">
      <input
        v-for="(digit, index) in modelValue"
        :key="index"
        :ref="(el) => setInputRef(el as HTMLInputElement, index)"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="digit"
        :disabled="disabled"
        @input="handleInput(index, $event)"
        @keydown="handleKeyDown(index, $event)"
        @paste="handlePaste"
        :class="[
          `w-12 h-12 sm:w-14 sm:h-14
           text-center text-[26px] sm:text-[32px] font-bold
           border-2 rounded-xl
           transition-all duration-200
           bg-white shadow-sm outline-none
           [appearance:textfield]
           [&::-webkit-outer-spin-button]:appearance-none
           [&::-webkit-inner-spin-button]:appearance-none`,
          error
            ? 'border-red-500 focus:border-red-500'
            : 'border-primary/50 focus:border-primary',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'
        ]"
      >
    </div>

    <div v-if="error" class="text-center">
      <p class="text-sm text-red-600">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>