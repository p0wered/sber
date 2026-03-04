<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue';

  const props = defineProps<{
    modelValue: string;
    maxLength?: number;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'wrong-layout'): void;
    (e: 'gender-detected', gender: string): void;
    (e: 'input'): void;
    (e: 'blur'): void;
  }>();

  interface SuggestionData {
    surname: string;
    name: string;
    patronymic: string | null;
    gender: 'MALE' | 'FEMALE' | 'UNKNOWN' | null;
    source: string | null;
    qc: string;
  }

  interface Suggestion {
    value: string;
    unrestricted_value: string;
    data: SuggestionData;
  }

  const suggestions = ref<Suggestion[]>([]);
  const showSuggestions = ref(false);
  const inputContainer = ref<HTMLDivElement | null>(null);
  let debounceTimer: number | null = null;

  function emitGender(genderValue: 'MALE' | 'FEMALE' | 'UNKNOWN' | null) {
    if (!genderValue) return;

    if (genderValue === 'UNKNOWN') {
      emit('gender-detected', '');
    } else if (genderValue === 'MALE' || genderValue === 'FEMALE') {
      const gender = genderValue === 'MALE' ? 'm' : 'f';
      emit('gender-detected', gender);
    }
  }

  async function getSuggestions(query: string): Promise<Suggestion[]> {
    try {
      const response = await fetch(`/api/suggest?type=fio&part=full_name&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Ошибка получения подсказок для ФИО:', error);
      return [];
    }
  }

  async function fetchSuggestions(query: string) {
    if (!query) {
      suggestions.value = [];
      showSuggestions.value = false;
      return;
    }

    const data = await getSuggestions(query);
    suggestions.value = data;
    showSuggestions.value = data.length > 0;

    if (data.length > 0) {
      emitGender(data[0].data.gender);
    }
  }

  async function detectGender(query: string) {
    if (!query) return;

    const data = await getSuggestions(query);
    if (data.length > 0) {
      emitGender(data[0].data.gender);
    }
  }

  function onBlur() {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    showSuggestions.value = false;
    emit('blur');
  }

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement;

    emit('update:modelValue', target.value);
    emit('input');

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      fetchSuggestions(target.value);
    }, 300);
  }

  function selectSuggestion(sugg: Suggestion) {
    emit('update:modelValue', sugg.value);
    emitGender(sugg.data.gender);
    showSuggestions.value = false;
    emit('blur');
  }

  function handleClickOutside(event: MouseEvent) {
    if (inputContainer.value && !inputContainer.value.contains(event.target as Node)) {
      showSuggestions.value = false;
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  watch(() => props.modelValue, async (newVal) => {
    const query = newVal?.trim() ?? '';
    if (query && query.split(/\s+/).filter(Boolean).length >= 1) {
      await detectGender(query);
    }
  }, { immediate: true });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <div ref="inputContainer">
    <div class="relative">
      <input
        id="name-input"
        type="text"
        :value="props.modelValue"
        placeholder=" "
        @input="onInput"
        @blur="onBlur"
        class="peer w-full px-4 py-3 mt-5 focus:outline-none focus:shadow-md border
        md:text-[18px] text-[16px] transition-all bg-secondary focus:bg-white"
        :class="[
          props.isError
            ? 'border-red-500 focus:border-red-500'
            : 'border-transparent focus:border-primary',
          showSuggestions
            ? 'rounded-tr-lg rounded-tl-lg !border-b-gray-200'
            : 'rounded-lg'
        ]"
      >
      <label
        for="name-input"
        class="absolute left-0 transition-all duration-200 origin-top-left
        text-[16px] md:text-[18px] text-gray-500 peer-focus:text-primary
        top-[-5%] peer-focus:top-[-5%] peer-placeholder-shown:top-[47%]
        scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100
        pl-2 peer-focus:pl-2 peer-placeholder-shown:pl-4 pointer-events-none"
      >
        Фамилия Имя Отчество
      </label>
      <ul
        class="absolute w-full border-t-transparent
        bg-white border border-primary transition-all
        rounded-bl-lg rounded-br-lg p-2 z-999"
        :class="[
          showSuggestions
            ? 'max-h-60 opacity-100 overflow-y-auto'
            : 'max-h-0 opacity-0 overflow-hidden'
        ]"
      >
        <li
          v-for="(sugg, index) in suggestions"
          :key="index"
          class="px-4 py-2 rounded-md cursor-pointer text-[16px] transition
          hover:bg-primary/10 active:bg-primary/10 "
          @mousedown.prevent="selectSuggestion(sugg)">
          {{ sugg.value }}
        </li>
      </ul>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
  </div>
</template>