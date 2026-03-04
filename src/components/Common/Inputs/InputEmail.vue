<script setup lang="ts">
  import { ref, watch } from 'vue';
  import axios from 'axios';

  interface EmailSuggestion {
    value: string;
    unrestricted_value: string;
    data: {
      local: string;
      domain: string;
      type: string | null;
      source: string | null;
      qc: number | null;
    };
  }

  interface SuggestResponse {
    suggestions: EmailSuggestion[];
  }

  const props = defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'blur'): void;
    (e: 'input'): void;
  }>();

  const allowedDomains = [
    '@mail.ru',
    '@ya.ru',
    '@yandex.ru',
    '@gmail.com',
    '@inbox.ru',
    '@list.ru',
    '@bk.ru',
    '@internet.ru'
  ];

  const suggestions = ref<EmailSuggestion[]>([]);
  const showSuggestions = ref(false);
  const showDomainWarning = ref(false);
  const debounceTimer = ref<number | null>(null);
  const isLoadingSuggestions = ref(false);

  const fetchSuggestions = async (query: string) => {
    if (!query || query.trim().length === 0) {
      suggestions.value = [];
      showSuggestions.value = false;
      return;
    }

    isLoadingSuggestions.value = true;
    try {
      const response = await axios.get<SuggestResponse>('/api/suggest', {
        params: {
          type: 'email',
          part: 'full_name',
          q: query
        }
      });

      if (response.data && response.data.suggestions) {
        suggestions.value = response.data.suggestions;
        showSuggestions.value = suggestions.value.length > 0;
      } else {
        suggestions.value = [];
        showSuggestions.value = false;
      }
    } catch (error) {
      console.error('Ошибка получения подсказок email:', error);
      suggestions.value = [];
      showSuggestions.value = false;
    } finally {
      isLoadingSuggestions.value = false;
    }
  };

  const debouncedFetchSuggestions = (query: string) => {
    if (debounceTimer.value !== null) {
      clearTimeout(debounceTimer.value);
    }

    debounceTimer.value = window.setTimeout(() => {
      fetchSuggestions(query);
    }, 200);
  };

  const checkDomainWarning = (email: string) => {
    if (!email || !email.includes('@')) {
      showDomainWarning.value = false;
      return;
    }

    const domain = '@' + email.split('@')[1];
    showDomainWarning.value = !allowedDomains.some(allowed => 
      domain.toLowerCase() === allowed.toLowerCase()
    );
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    emit('update:modelValue', value);
    emit('input');
    
    showDomainWarning.value = false;
    
    debouncedFetchSuggestions(value);
  };

  const handleBlur = () => {
    showSuggestions.value = false;
    checkDomainWarning(props.modelValue);
    emit('blur');
  };

  const selectSuggestion = (suggestion: EmailSuggestion) => {
    emit('update:modelValue', suggestion.value);
    emit('input');
    suggestions.value = [];
    showSuggestions.value = false;
    showDomainWarning.value = false;
  };

  const handleFocus = () => {
    showDomainWarning.value = false;
  };

  watch(() => {}, () => {
    if (debounceTimer.value !== null) {
      clearTimeout(debounceTimer.value);
    }
  });
</script>

<template>
  <div ref="inputContainer">
    <div class="relative">
      <input
        id="email-input"
        type="text"
        :value="props.modelValue"
        placeholder=" "
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        class="peer w-full px-4 py-3 mt-5 focus:outline-none focus:shadow-md border
        md:text-[18px] text-[16px] transition-all bg-secondary focus:bg-white z-0"
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
        for="email-input"
        class="absolute left-0 transition-all duration-200 origin-top-left
        text-[16px] md:text-[18px]
        text-gray-500 peer-focus:text-primary pointer-events-none
        top-[-5%] peer-focus:top-[-5%] peer-placeholder-shown:top-[47%]
        scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100
        pl-2 peer-focus:pl-2 peer-placeholder-shown:pl-4"
      >
        Email
      </label>
      <ul
        class="absolute w-full z-10 border-t-transparent
        bg-white border border-primary transition-all
        rounded-bl-lg rounded-br-lg px-2"
        :class="[
          showSuggestions
            ? 'max-h-60 opacity-100 overflow-y-auto py-2'
            : 'max-h-0 opacity-0 overflow-hidden py-0'
        ]"
      >
        <li
          v-for="(sugg, index) in suggestions"
          :key="index"
          class="px-4 py-2 rounded-md cursor-pointer text-[16px] transition
          hover:bg-primary/10 active:bg-primary/10"
          @mousedown.prevent
          @click="selectSuggestion(sugg)"
        >
          {{ sugg.value }}
        </li>
      </ul>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
    <p v-if="showDomainWarning && !props.isError" class="mt-3 text-xs text-orange-500">
      Для увеличения шансов получения займа рекомендуем использовать почтовый адрес на сервисах Mail, Яндекс или Google.
    </p>
  </div>
</template>