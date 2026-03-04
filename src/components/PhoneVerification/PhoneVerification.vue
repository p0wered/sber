<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
  import { Check, Clock, Edit3, Globe, Lock, Phone, Smartphone } from 'lucide-vue-next';
  import { usePhoneVerification } from './usePhoneVerification';
  import { useClientInfo } from './useClientInfo';
  import { validatePhone } from '@/utils/validators.ts';
  import router from "@/router";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import InputPhone from "@/components/Common/Inputs/InputPhone.vue";
  import DocumentsBlock from "@/components/PhoneVerification/DocumentsBlock.vue";
  import InputCode from "@/components/Common/Inputs/InputCode.vue";

  const props = defineProps<{
    show: boolean;
  }>();

  const emit = defineEmits<{
    'phone-verified': [];
  }>();

  const token = "X9d7QpL2mVt4bNcEwRf3";
  const countdownDuration = 20;
  const codeLength = 4;

  const { ip, device, logData } = useClientInfo();

  const {
    isLoadingPhone,
    isLoadingCode,
    isCallRequested,
    canCallAgain,
    remainingTime,
    code,
    codeError,
    requestCall,
    verify,
    clearTimer
  } = usePhoneVerification({ token, countdownDuration, codeLength });

  const phoneNumber = ref('');
  const phoneError = ref<string>('');
  const isEditingPhone = ref(false);
  const tempPhone = ref('');
  const codeInputRef = ref<InstanceType<typeof InputCode> | null>(null);

  const formatPhoneNumber = (phone: string): string => phone.replace(/\D/g, '');

  const clearPhoneError = () => {
    phoneError.value = '';
  };

  const createPhoneVerification = async () => {
    const phoneFromStorage = localStorage.getItem('phone');

    if (!phoneFromStorage) {
      phoneError.value = 'Номер не задан';
      return;
    }

    const validationMsg = validatePhone(phoneFromStorage);
    if (validationMsg) {
      phoneError.value = validationMsg;
      return;
    }

    try {
      const formattedPhone = formatPhoneNumber(phoneFromStorage);
      await requestCall(formattedPhone);

      await nextTick();
      codeInputRef.value?.focusFirst?.();
    } catch (e: any) {
      console.error('createPhoneVerification error', e);
      phoneError.value = phoneError.value || 'Не удалось запросить звонок. Попробуйте позже.';
    }
  };

  const handleRequestCall = () => {
    if (!isCallRequested.value) {
      void createPhoneVerification();
    } else if (canCallAgain.value) {
      void createPhoneVerification();
    }
  };

  const handleCodeComplete = () => {
    if (codeError.value) {
      codeError.value = '';
    }
  };

  const handleVerify = async () => {
    const fullCode = code.value.join('');

    if (fullCode.length !== codeLength) {
      codeError.value = `Код должен содержать ${codeLength} цифры`;
      return;
    }

    const res = await verify(fullCode);
    if (res.success) {
      emit('phone-verified');
    }
  };

  const handlePhoneEdit = () => {
    if (isEditingPhone.value) {
      const err = validatePhone(tempPhone.value);
      if (err) {
        phoneError.value = err;
        return;
      }
      phoneNumber.value = tempPhone.value;
      localStorage.setItem('phone', tempPhone.value);
      phoneError.value = '';
      isEditingPhone.value = false;
    } else {
      tempPhone.value = phoneNumber.value;
      isEditingPhone.value = true;
    }
  };

  const cancelPhoneEdit = () => {
    isEditingPhone.value = false;
    phoneError.value = '';

    const phoneFromStorage = localStorage.getItem('phone');
    if (phoneFromStorage) {
      tempPhone.value = phoneFromStorage;
    } else {
      tempPhone.value = phoneNumber.value;
    }
  };

  onMounted(() => {
    if (props.show) {
      const phoneFromStorage = localStorage.getItem('phone');
      if (phoneFromStorage) {
        phoneNumber.value = phoneFromStorage;
        const err = validatePhone(phoneFromStorage);
        if (err) phoneError.value = err;
      }
    }
  });

  onUnmounted(() => {
    document.body.style.overflow = '';
    clearTimer();
  });

  watch(() => props.show, (newValue) => {
    if (newValue) {
      const phoneFromStorage = localStorage.getItem('phone');

      if (phoneFromStorage) {
        phoneNumber.value = phoneFromStorage;
        const err = validatePhone(phoneFromStorage);
        if (err) phoneError.value = err;
      }

      document.body.style.overflow = 'hidden';
      code.value = Array.from({ length: codeLength }).map(() => '');
      codeError.value = '';
    } else {
      document.body.style.overflow = '';
      clearTimer();
    }
  });
</script>

<template>
  <div
    v-if="props.show"
    class="
    phone-verification-overlay
    fixed top-0 left-0 p-3
    w-full h-full
    bg-black/50 backdrop-blur-[15px]
    flex justify-center items-center
    z-[9999]"
  >
    <div
      class="
      phone-verification-popup
      relative w-full max-w-2xl
      bg-white rounded-2xl sm:rounded-3xl
      shadow-2xl border border-stone-200/50
      overflow-hidden"
    >
      <div
        class="
        p-4 sm:p-6 md:p-8
        space-y-4 sm:space-y-6
        max-h-[95dvh] overflow-y-auto"
      >
        <div class="text-center space-y-3 sm:space-y-4">
          <div class="flex items-center justify-center">
            <div
              class="
              p-2 sm:p-3
              bg-gradient-to-br from-blue-100 to-indigo-100
              rounded-xl sm:rounded-2xl"
            >
              <Lock class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          <h1
            class="
            text-lg sm:text-lg md:text-xl font-bold
            text-stone-900 leading-tight px-2"
          >
            ПОДПИСАНИЕ СОГЛАСИЯ ПРОСТОЙ ЭЛЕКТРОННОЙ ПОДПИСЬЮ (№63-ФЗ)
          </h1>

          <p class="text-sm sm:text-base text-stone-600 px-2">
            Продолжая использование сайта, вводя данные банковской карты
            и подтверждая оплату через 3-D Secure, вы соглашаетесь с
          </p>
        </div>

        <div class="space-y-2 sm:space-y-3">
          <DocumentsBlock/>
        </div>

        <div
          class="
          bg-primary/5 rounded-2xl sm:rounded-2xl
          p-4 sm:p-6
          border-1 border-primary/50 shadow-md
          space-y-4 sm:space-y-5"
        >
          <div
            class="
            bg-white backdrop-blur-sm rounded-xl
            p-3 sm:p-4
            border border-black/15"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-start gap-3 flex-1">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <Phone class="w-4 h-4 text-primary" />
                </div>

                <div class="flex-1">
                  <p class="text-sm sm:text-base text-stone-600 mb-1">
                    Номер для подтверждения:
                  </p>

                  <div v-if="isEditingPhone" class="space-y-3">
                    <div class="relative">
                      <InputPhone
                        v-model="tempPhone"
                        :is-error="!!phoneError"
                        :error-message="phoneError"
                        :small="true"
                        :save-on-change="false"
                        @blur="phoneError = validatePhone(tempPhone)"
                        @input="clearPhoneError"
                        class="text-base font-semibold"
                      />
                    </div>
                    <div class="flex gap-2">
                      <button
                        @click="handlePhoneEdit"
                        class="
                        flex items-center gap-1.5
                        px-3 py-1.5
                        bg-primary hover:bg-primary-dark
                        text-white text-sm sm:text-base font-medium
                        rounded-lg transition cursor-pointer"
                      >
                        <Check class="w-3 h-3" />
                        Сохранить
                      </button>
                      <button
                        @click="cancelPhoneEdit"
                        class="
                        flex items-center gap-1.5
                        px-3 py-1.5
                        hover:bg-stone-200 text-stone-700
                        text-sm sm:text-base font-medium
                        rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>

                  <div v-else class="flex flex-wrap items-center gap-2">
                    <p class="text-sm sm:text-base font-semibold text-stone-900">
                      {{ phoneNumber }}
                    </p>
                    <button
                      @click="handlePhoneEdit"
                      class="
                      flex items-center gap-1.5
                      sm:px-2.5 sm:py-1.5
                      text-sm sm:text-base text-primary hover:text-primary/70
                      transition"
                    >
                      <Edit3 class="w-3 h-3"/>
                      <span class="font-medium cursor-pointer">
                        Изменить
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="
            bg-white backdrop-blur-sm rounded-xl
            p-3 sm:p-4
            border border-black/15"
          >
            <h3
              class="
              font-semibold text-stone-900
              mb-2 sm:mb-3
              text-sm sm:text-base"
            >
              Техническая инструкция:
            </h3>
            <ol class="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-stone-700">
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary flex-shrink-0">1.</span>
                <span>На ваш номер поступит звонок</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary flex-shrink-0">2.</span>
                <span>Введите последние 4 цифры входящего вызова в поля ниже</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-primary flex-shrink-0">3.</span>
                <span>Нажмите «Подтвердить и подписать»</span>
              </li>
            </ol>
          </div>

          <div v-if="!isCallRequested" class="text-center">
            <ButtonPrimary
              @click="handleRequestCall"
              label="Запросить звонок"
              :icon="Phone"
              :is-loading="isLoadingPhone"
            />
          </div>

          <div v-else class="space-y-4">
            <div
              class="
              bg-white backdrop-blur-sm rounded-xl
              p-3 sm:p-4
              border border-black/15"
            >
              <p
                class="
                text-sm text-stone-700 mb-3
                text-center font-medium"
              >
                Введите последние 4 цифры входящего звонка:
              </p>
              <div class="flex justify-center gap-2 sm:gap-3">
                <InputCode
                  ref="codeInputRef"
                  v-model="code"
                  :length="codeLength"
                  :error="codeError"
                  @complete="handleCodeComplete"
                />
              </div>
            </div>

            <div class="text-center">
              <button
                @click="handleRequestCall"
                :disabled="!canCallAgain"
                :class="[
                  `text-sm font-medium underline
                  decoration-dotted underline-offset-2
                  transition-colors`,
                  canCallAgain
                    ? 'text-primary hover:text-primary/70 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                ]"
              >
                {{ canCallAgain ? 'Повторный звонок' : `Повторный звонок (${remainingTime} c)` }}
              </button>
            </div>
          </div>
        </div>

        <div
          class="
          text-xs text-stone-500
          bg-stone-100 p-2.5 sm:p-3
          rounded-lg sm:rounded-xl
          leading-relaxed"
        >
          Ввод кода и нажатие «Подтвердить и подписать» является подтверждением вашего согласия, приравненным к
          простой электронной подписи (ПЭП) в соответствии с 63-ФЗ, с согласием на обработку персональных данных
          (152-ФЗ) и рекуррентные списания в рамках 161-ФЗ, оформленными в соответствии с Операционными правилами ПС
          НСПК МИР.
        </div>

        <div
          class="
          flex flex-col sm:flex-row items-center justify-center
          gap-2 sm:gap-4
          text-xs text-stone-500
          bg-stone-100 p-2.5 sm:p-3
          rounded-lg sm:rounded-xl"
        >
          <div class="flex items-center gap-1">
            <Globe class="w-3 h-3" />
            <span>IP: {{ ip }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Smartphone class="w-3 h-3" />
            <span class="truncate max-w-[280px]">
              {{ device }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Clock class="w-3 h-3" />
            <span class="text-center">{{ logData.timestamp }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row-reverse gap-2 sm:gap-3 pt-2">
          <ButtonPrimary
            @click="handleVerify"
            label="Подтвердить и подписать"
            :disabled="code.join('').length !== 4 || !isCallRequested"
            :is-loading="isLoadingCode"
            :icon="Lock"
          />
          <ButtonSecondary
            @click="router.push('/')"
            class="
            bg-gray-200 hover:bg-gray-300
            text-black/70 w-full py-4"
            label="Отказаться"
          />
        </div>
      </div>
    </div>
  </div>
</template>
