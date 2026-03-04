<script setup lang="ts">
  import { ref } from 'vue';
  import { useValidation } from '@/utils/use-validation';
  import { validateCardNumber, validatePhone } from '@/utils/validators';
  import { useComebacker } from "@/utils/common.ts";
  import { config } from '@/config';
  import axios from 'axios';
  import InputPhone from '@/components/Common/Inputs/InputPhone.vue';
  import InputCardNumber from '@/components/Common/Inputs/InputCardNumber.vue';
  import UnsubscribeModal from '@/components/UnsubscribeModal.vue';
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";

  interface UnsubscribeFormData {
    phoneUnsubscribe: string;
    cardNumberUnsubscribe: string;
  }

  const formData = ref<UnsubscribeFormData>({
    phoneUnsubscribe: '',
    cardNumberUnsubscribe: ''
  });

  const isLoading = ref(false);
  const successMessage = ref('');
  const apiError = ref('');
  const showUnsubscribeModal = ref(false);

  const { errors, validateFieldOnBlur, clearField, validateAll } = useValidation(formData.value, {
    phoneUnsubscribe: validatePhone,
    cardNumberUnsubscribe: validateCardNumber
  });

  const openTelegram = () => {
    window.open(config.bots.bot_support_link || `https://t.me/live_tehpodderzhka_bot`);
  };

  const openUnsubscribeModal = () => {
    if (!validateAll()) {
      return;
    }

    showUnsubscribeModal.value = true;
    document.body.style.overflow = 'hidden';
  };

  const closeUnsubscribeModal = () => {
    showUnsubscribeModal.value = false;
    document.body.style.overflow = '';
  };

  async function changeTariff() {
    closeUnsubscribeModal();

    successMessage.value = '';
    apiError.value = '';

    if (!validateAll()) {
      return;
    }

    isLoading.value = true;
    try {
      const requestData = new FormData();
      requestData.append('site_id', config.siteId.toString());
      requestData.append('phone', formData.value.phoneUnsubscribe);
      requestData.append('card_number', formData.value.cardNumberUnsubscribe);

      const response = await axios.post('https://api.mfo-0.ru/change-tariff', requestData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 403) {
        apiError.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
      } else {
        const data = typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
        if (data.status === 'success') {
          successMessage.value = 'Вы успешно сменили тариф на Базовый';
        } else {
          apiError.value = 'Мы не смогли найти активную подписку с такими данными. Пожалуйста, проверьте данные.';
        }
      }
    } catch {
      apiError.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
    } finally {
      isLoading.value = false;
    }
  }

  async function unsubscribe() {
    closeUnsubscribeModal();

    successMessage.value = '';
    apiError.value = '';

    isLoading.value = true;
    try {
      const requestData = new FormData();
      requestData.append('site_id', config.siteId.toString());
      requestData.append('phone', formData.value.phoneUnsubscribe);
      requestData.append('card_number', formData.value.cardNumberUnsubscribe);

      const response = await axios.post('https://api.mfo-0.ru/unsubscribe', requestData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 403) {
        apiError.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
      } else {
        const data = typeof response.data === 'string'
            ? JSON.parse(response.data)
            : response.data;
        if (data.status === 'success') {
          successMessage.value = 'Вы успешно отписаны от системы';
        } else {
          apiError.value = 'Мы не смогли найти активную подписку с такими данными. Пожалуйста, проверьте данные.';
        }
      }
    } catch {
      apiError.value = 'Техническая ошибка. Перезагрузите страницу или напишите нам на почту.';
    } finally {
      isLoading.value = false;
    }
  }

  useComebacker();
</script>

<template>
  <section class="min-h-[calc(100vh-94px)]">
    <div
      class="md:p-10 p-5 bg-white md:border-1 border-b-1
      border-gray-200 max-w-2xl mx-auto md:my-8 mb-4 md:rounded-3xl"
      data-aos="fade-in"
    >
      <div class="mb-6">
        <h2 class="text-2xl text-black font-bold mb-2">
          Отписаться от платных услуг
        </h2>
        <p class="text-sm text-black/70">
          Мы не сможем отписать Вас от сервиса, если данные будут отличаться
        </p>
      </div>

      <div class="flex flex-col justify-between gap-4 w-full">
        <InputPhone
          v-model="formData.phoneUnsubscribe"
          id="phone-input"
          :is-error="!!errors.phoneUnsubscribe"
          :error-message="errors.phoneUnsubscribe"
          @blur="validateFieldOnBlur('phoneUnsubscribe')"
          @input="clearField('phoneUnsubscribe'); apiError = ''"
        />
        <InputCardNumber
          v-model="formData.cardNumberUnsubscribe"
          id="card_number"
          :is-error="!!errors.cardNumberUnsubscribe"
          :error-message="errors.cardNumberUnsubscribe"
          @blur="validateFieldOnBlur('cardNumberUnsubscribe')"
          @input="clearField('cardNumberUnsubscribe'); apiError = ''"
        />
      </div>

      <div v-if="apiError" class="mt-4 text-sm text-red-600">
        {{ apiError }}
      </div>

      <div v-if="successMessage" class="mt-4 text-sm text-primary">
        {{ successMessage }}
      </div>

      <hr class="md:mt-8 mt-6 mb-4 border-gray-300" >

      <p class="text-xs text-black/50 md:mb-8 mb-6">
        <span class="text-primary">*</span> Информация обязательна для заполнения
      </p>

      <div class="flex md:flex-row flex-col gap-4">
        <ButtonPrimary
          @click="changeTariff"
          label="Сменить тариф"
          :is-loading="isLoading"
        />
        <ButtonSecondary
          class="p-4 w-full text-primary hover:text-primary-dark/70"
          @click="openUnsubscribeModal"
          label="Отписаться"
          :is-loading="isLoading"
        />
      </div>
    </div>

    <div
      class="max-w-2xl md:mx-auto mx-4 mb-6 p-6 rounded-3xl bg-primary/10"
      data-aos="fade-in"
    >
      <p class="mb-4">
        Если у вас не получается отписаться, вы забыли какую именно карту вы
        использовали – это не повод её блокировать или звонить в банк. Просто
        напишите нам в Telegram, мы отпишем вас в ручную.
      </p>
      <ButtonPrimary
        @click="openTelegram"
        label="Написать в Telegram"
      />
    </div>

    <UnsubscribeModal
      :show="showUnsubscribeModal"
      @close="closeUnsubscribeModal"
      @changeTariff="changeTariff"
      @unsubscribe="unsubscribe"
    />
  </section>
</template>
