<script setup lang="ts">
  import { ref, watch } from 'vue';
  import axios from 'axios';

  const props = defineProps<{
    modelValue: string;
    divisionCode?: boolean;
    placeholder?: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input'): void;
    (e: 'blur'): void;
  }>();

  const localValue = ref(formatValue(props.modelValue));
  const departmentName = ref<string>('');
  const isLoadingDepartment = ref(false);

  watch(
    () => props.modelValue,
    (newVal) => {
      const formatted = formatValue(newVal);
      if (formatted !== localValue.value) {
        localValue.value = formatted;
      }
    }
  );

  function formatValue(raw: string): string {
    return props.divisionCode
        ? formatDivision(raw)
        : formatPassport(raw);
  }

  function formatPassport(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 10);
    if (digits.length > 4) {
      return digits.slice(0, 4) + ' ' + digits.slice(4);
    }
    return digits;
  }

  function formatDivision(value: string): string {
    const digits = value.replace(/\D+/g, '').slice(0, 6);
    if (digits.length > 3) {
      return digits.slice(0, 3) + '-' + digits.slice(3);
    }
    return digits;
  }

  async function fetchDepartmentName(depCode: string) {
    if (depCode.length !== 6) {
      departmentName.value = '';
      return;
    }

    isLoadingDepartment.value = true;
    try {
      const requestData = new URLSearchParams();
      requestData.append('action', 'dep_text');
      requestData.append('dep_code', depCode);

      const response = await axios.post('https://api.mfo-0.ru/check', requestData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      if (response.data.status === 'success' && response.data.value) {
        departmentName.value = response.data.value;
      } else {
        departmentName.value = '';
      }
    } catch (error) {
      console.error('Error fetching department name:', error);
      departmentName.value = '';
    } finally {
      isLoadingDepartment.value = false;
    }
  }

  function onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const formatted = formatValue(input.value);
    localValue.value = formatted;
    emit('update:modelValue', formatted);
    emit('input');

    if (props.divisionCode) {
      const digits = formatted.replace(/\D+/g, '');
      fetchDepartmentName(digits);
    }
  }
  
  function onBlur() {
    emit('blur');
  }
</script>

<template>
  <div>
    <div class="relative">
      <input
        id="passport-input"
        type="text"
        inputmode="numeric"
        :value="localValue"
        :maxlength="props.divisionCode ? 7 : 11"
        :placeholder="props.divisionCode ? '123-456' : '5413 123456'"
        @input="onInput"
        @blur="onBlur"
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
        for="passport-input"
        class="absolute left-0 transition-all duration-200 origin-top-left
        text-[16px] md:text-[18px]
        text-gray-500 peer-focus:text-primary pointer-events-none
        top-[-5%] peer-focus:top-[-5%] peer-placeholder-shown:top-[47%]
        scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100
        pl-2 peer-focus:pl-2 peer-placeholder-shown:pl-4"
      >
        {{ props.divisionCode ? 'Код подразделения' : 'Номер и серия паспорта'}}
      </label>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
    <p v-if="!props.isError && props.divisionCode && departmentName" class="mt-2 text-xs text-black/60">
      {{ departmentName }}
    </p>
  </div>
</template>
