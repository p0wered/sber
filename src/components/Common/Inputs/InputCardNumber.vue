<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
  }>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input'): void;
    (e: 'blur'): void;
  }>();

  const rawValue = ref('');

  watch(
      () => props.modelValue,
      (val) => {
        rawValue.value = (val || '').replace(/\D/g, '').slice(0, 10);
      },
      { immediate: true }
  );

  function formatFromRaw(digits: string) {
    const len = digits.length;
    if (len > 6) {
      const firstSix = digits.slice(0, 6);
      const lastFour = digits.slice(6);
      const core = firstSix + '*'.repeat(6) + lastFour;
      return (core.match(/.{1,4}/g) || []).join(' ');
    }
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const digits = target.value.replace(/\D/g, '').slice(0, 10);
    rawValue.value = digits;
    emit('update:modelValue', digits);
    emit('input');
  }

  function onBlur() {
    emit('blur');
  }

  const formattedValue = computed<string>(() => {
    return formatFromRaw(rawValue.value);
  });
</script>

<template>
  <div>
    <div class="relative">
      <input
        :value="formattedValue"
        @input="onInput"
        @blur="onBlur"
        placeholder="Первые 6 и последние 4 цифры"
        maxlength="19"
        inputmode="numeric"
        class="peer w-full px-4 py-3 mt-5 border rounded-lg focus:outline-none
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
        Номер привязанной карты
      </label>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
