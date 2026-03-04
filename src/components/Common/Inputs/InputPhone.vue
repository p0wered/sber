<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import axios from 'axios';
  import LogoBeeline from '@/assets/images/operators/operator-beeline.webp';
  import LogoMegafon from '@/assets/images/operators/operator-megafon.webp';
  import LogoMts from '@/assets/images/operators/operator-mts.webp';
  import LogoMtt from '@/assets/images/operators/operator-mtt.webp';
  import LogoRostelecom from '@/assets/images/operators/operator-rostelecom.webp';
  import LogoT2 from '@/assets/images/operators/operator-t2.webp';
  import LogoTinkoff from '@/assets/images/operators/operator-tinkoff.webp';
  import LogoTtk from '@/assets/images/operators/operator-ttk.webp';
  import LogoTmt from '@/assets/images/operators/operator-tmt.webp';
  import LogoYota from '@/assets/images/operators/operator-yota.webp';

  const props = withDefaults(defineProps<{
    modelValue: string;
    isError?: boolean;
    errorMessage?: string;
    small?: boolean;
    saveOnChange?: boolean;
    showOperator?: boolean;
  }>(), {
    saveOnChange: true,
    small: false,
    showOperator: false
  });

  const operatorLogos: Record<string, string> = {
    'вымпел-коммуникации': LogoBeeline,
    'мегафон': LogoMegafon,
    'мобильные телесистемы': LogoMts,
    'т2': LogoT2,
    'ростелеком': LogoRostelecom,
    'тинькофф': LogoTinkoff,
    'т-моб': LogoTinkoff,
    'транстелеком': LogoTtk,
    'мтт': LogoMtt,
    'тмт': LogoTmt,
    'скартел': LogoYota
  };

  function findOperatorLogo(carrierName: string): string | null {
    if (!carrierName || carrierName === 'undefined') return null;

    const normalizedCarrier = carrierName.toLowerCase();

    for (const [keyword, logo] of Object.entries(operatorLogos)) {
      if (normalizedCarrier.includes(keyword)) {
        return logo;
      }
    }

    return null;
  }

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'input'): void;
    (e: 'blur'): void;
  }>();

  const localStorageKey = 'phone';

  const inputRef = ref<HTMLInputElement>();
  const digits = ref('');
  const isFocused = ref(false);
  const operatorLogo = ref<string | null>(null);
  const operatorRegion = ref<string | null>(null);
  const isLoadingOperator = ref(false);
  const isImageLoaded = ref(false);
  const previousDigitsLength = ref(0);
  let operatorCheckTimeout: ReturnType<typeof setTimeout> | null = null;
  const preloadedImages = new Map<string, HTMLImageElement>();

  const preloadImages = () => {
    Object.values(operatorLogos).forEach(src => {
      if (!preloadedImages.has(src)) {
        const img = new Image();
        img.src = src;
        preloadedImages.set(src, img);
      }
    });
  };

  onMounted(() => {
    preloadImages();

    if (props.saveOnChange) {
      const savedPhone = localStorage.getItem(localStorageKey);
      if (savedPhone) {
        const raw = savedPhone.replace(/\D/g, '');
        let d = raw.startsWith('7') ? raw.slice(1, 11) : raw.slice(0, 10);
        
        if (d.length > 0 && d[0] !== '9') {
          d = '9' + d.slice(0, 9);
        }
        
        digits.value = d;
        emit('update:modelValue', formatted.value);
        return;
      }
    }
  });

  const formatted = computed(() => {
    if (!isFocused.value && !digits.value) return '';

    const d = digits.value;
    let result = '+7 ';
    if (d.length === 0) return result;

    const p1 = d.slice(0, 3);
    result += '(' + p1;
    if (d.length < 3) return result;
    result += ') ';

    const p2 = d.slice(3, 6);
    result += p2;
    if (d.length < 6) return result;
    result += '-';

    const p3 = d.slice(6, 8);
    result += p3;
    if (d.length < 8) return result;
    result += '-';

    const p4 = d.slice(8, 10);
    result += p4;
    return result;
  });

  function setCaret(pos: number) {
    nextTick(() => inputRef.value?.setSelectionRange(pos, pos));
  }

  function onFocus() {
    isFocused.value = true;
    if (!digits.value) {
      setCaret(3);
    }
  }

  function onBlur() {
    isFocused.value = false;
    if (!digits.value) {
      emit('update:modelValue', '');
      if (props.saveOnChange) localStorage.removeItem(localStorageKey);
    }
    emit('blur');
  }

  function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    let d = val.replace(/\D/g, '');

    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    d = d.slice(0, 10);

    const needsAuto9 = d.length > 0 && d[0] !== '9';

    if (needsAuto9) {
      d = '9' + d.slice(0, 9);
    }

    const isAdding = d.length > previousDigitsLength.value;
    previousDigitsLength.value = d.length;

    digits.value = d;
    emit('update:modelValue', formatted.value);
    emit('input');

    if (needsAuto9 && d.length === 1) {
      nextTick(() => {
        setCaret(5);
      });
    }

    if (props.showOperator && isAdding && d.length >= 4) {
      checkOperator();
    } else if (d.length < 4) {
      operatorLogo.value = null;
      operatorRegion.value = null;
      isImageLoaded.value = false;
    }
  }

  async function checkOperator() {
    if (operatorCheckTimeout) {
      clearTimeout(operatorCheckTimeout);
      operatorCheckTimeout = null;
    }

    if (digits.value.length < 4) {
      operatorLogo.value = null;
      operatorRegion.value = null;
      return;
    }

    operatorCheckTimeout = setTimeout(async () => {
      isLoadingOperator.value = true;
      try {
        const response = await axios.get('/api/phone-verify', {
          headers: { 'Content-Type': 'application/json' },
          params: { phone: formatted.value }
        });

        if (response.data && response.data.carrier && response.data.carrier !== 'undefined') {
          const logo = findOperatorLogo(response.data.carrier);

          if (logo) {
            isImageLoaded.value = false;
            operatorLogo.value = logo;

            await nextTick(() => {
              isImageLoaded.value = true;
            });
          } else {
            operatorLogo.value = null;
          }

          if (response.data.region && response.data.region !== 'undefined') {
            operatorRegion.value = response.data.region;
          } else {
            operatorRegion.value = null;
          }
        } else {
          operatorLogo.value = null;
          operatorRegion.value = null;
        }
      } catch (error) {
        console.error('Ошибка получения оператора:', error);
        operatorLogo.value = null;
        operatorRegion.value = null;
      } finally {
        isLoadingOperator.value = false;
      }
    }, 200);
  }

  function onKeyDown(e: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
      'Home', 'End'
    ];
    if (allowedKeys.includes(e.key)) return;

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }

    const start = inputRef.value?.selectionStart || 0;
    
    if ((e.key === 'Backspace' || e.key === 'Delete') && start <= 4) {
      e.preventDefault();
    }
  }

  watch(() => props.modelValue, (newValue) => {
    const raw = String(newValue || '').replace(/\D/g, '');
    let normalized = raw.startsWith('7') ? raw.slice(1, 11) : raw.slice(0, 10);
    
    if (normalized.length > 0 && normalized[0] !== '9') {
      normalized = '9' + normalized.slice(0, 9);
    }
    
    if (normalized !== digits.value) {
      digits.value = normalized;
      if (props.showOperator && normalized.length >= 4) {
        checkOperator();
      }
    }

    if (props.saveOnChange) {
      if (newValue) {
        localStorage.setItem(localStorageKey, newValue);
      } else {
        localStorage.removeItem(localStorageKey);
      }
    }
  }, { immediate: true });
</script>

<template>
  <div>
    <div class="relative">
      <input
        id="phone-input"
        type="tel"
        ref="inputRef"
        :value="formatted"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        placeholder=" "
        maxlength="18"
        inputmode="numeric"
        class="peer w-full bg-secondary border rounded-lg
        focus:outline-none focus:bg-white transition focus:shadow-sm"
        :class="[
          props.isError
            ? 'border-red-500 focus:border-red-500'
            : 'border-transparent focus:border-primary',
          props.small
            ? 'px-2 py-1 md:text-[16px] text-[14px]'
            : 'px-4 py-3 md:text-[18px] text-[16px] mt-5',
          operatorLogo && showOperator ? 'pr-14' : ''
        ]"
      >
      <label
        v-if="!small"
        for="phone-input"
        class="absolute left-0 transition-all duration-200 origin-top-left
        text-gray-500 peer-focus:text-primary pointer-events-none
        top-[-5%] peer-focus:top-[-5%] peer-placeholder-shown:top-[47%]
        scale-75 peer-focus:scale-75 peer-placeholder-shown:scale-100
        pl-2 peer-focus:pl-2 peer-placeholder-shown:pl-4"
        :class="[
          props.small ? 'text-[14px] md:text-[16px]' : 'text-[16px] md:text-[18px]'
        ]"
      >
        Номер телефона
      </label>

      <div
        v-if="showOperator"
        class="w-7 h-7 absolute right-3.5 top-[45%] flex items-center
        justify-center transition-opacity rounded-sm overflow-hidden"
        :class="operatorLogo ? 'opacity-100' : 'opacity-0'"
      >
        <img
          v-if="operatorLogo"
          :src="operatorLogo"
          alt="Logo"
          class="w-full h-full object-contain"
        >
      </div>
    </div>
    <p v-if="props.isError && props.errorMessage" class="mt-2 text-xs text-red-500">
      {{ props.errorMessage }}
    </p>
    <p v-else-if="operatorRegion" class="mt-2 text-xs text-black/60">
      {{ operatorRegion }}
    </p>
  </div>
</template>