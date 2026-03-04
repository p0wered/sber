<script setup lang="ts">
  import { onMounted, watch } from "vue";
  import { useAutoDocs } from "@/utils/auto-docs.ts";
  import { setCookie } from "@/utils/common.ts";
  import CheckboxPrimary from "@/components/Common/Checkboxes/CheckboxPrimary.vue";
  
  const props = defineProps<{
    checkboxOne: boolean;
    checkboxTwo: boolean;
    isErrorOne?: boolean;
    isErrorTwo?: boolean;
    showSecondCheckbox?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:checkboxOne', value: boolean): void;
    (e: 'update:checkboxTwo', value: boolean): void;
  }>();

  const localStorageKeyOne = 'isChecked1';
  const localStorageKeyTwo = 'isChecked2';

  const setAgreementTime = () => {
    const currentDate = new Date().toISOString();
    setCookie('agreement_time', currentDate);
  };

  onMounted(() => {
    const savedCheckboxOne = localStorage.getItem(localStorageKeyOne);
    if (savedCheckboxOne !== null) {
      emit('update:checkboxOne', savedCheckboxOne === 'true');
    }

    if (props.showSecondCheckbox) {
      const savedCheckboxTwo = localStorage.getItem(localStorageKeyTwo);
      if (savedCheckboxTwo !== null) {
        emit('update:checkboxTwo', savedCheckboxTwo === 'true');
      }
    }
  });

  const updateCheckboxOne = (value: boolean | string[]) => {
    if (typeof value === 'boolean') {
      emit('update:checkboxOne', value);
    }

    if (value) {
      setAgreementTime();
    }
  };

  const updateCheckboxTwo = (value: boolean | string[]) => {
    if (typeof value === 'boolean') {
      emit('update:checkboxTwo', value);
    }

    if (value) {
      setAgreementTime();
    }
  };

  watch(() => props.checkboxOne, (newValue) => {
    localStorage.setItem(localStorageKeyOne, String(newValue));
  });

  watch(() => props.checkboxTwo, (newValue) => {
    if (props.showSecondCheckbox) {
      localStorage.setItem(localStorageKeyTwo, String(newValue));
    } else {
      localStorage.removeItem(localStorageKeyTwo);
    }
  });

  const {
    publicOfertaPdf,
    personalDataPoliticPdf,
    personalDataAgreementPdf,
    paidSubAgreementPdf,
    recurrPaymentsAgreementPdf,
    cardDataAgreementPdf
  } = useAutoDocs();
</script>

<template>
  <div class="flex flex-col gap-4 pt-4">
    <CheckboxPrimary
      :model-value="props.checkboxOne"
      @update:model-value="updateCheckboxOne"
      :is-error="props.isErrorOne"
    >
      Заполняя заявку на сайте вы даете согласие со следующими условиями:
      <a
        v-if="publicOfertaPdf"
        :href="publicOfertaPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Публичная оферта
      </a> и
      <a>действующие тарифы</a>,
      <a
        v-if="personalDataPoliticPdf"
        :href="personalDataPoliticPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Политика обработки персональных данных
      </a>,
      <a
        v-if="personalDataAgreementPdf"
        :href="personalDataAgreementPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Согласие на обработку персональных данных
      </a>.
    </CheckboxPrimary>

    <CheckboxPrimary
      v-if="props.showSecondCheckbox"
      :model-value="props.checkboxTwo"
      @update:model-value="updateCheckboxTwo"
      :is-error="props.isErrorTwo"
    >
      Заполняя заявку на сайте вы даете согласие со следующими условиями:
      <a
        v-if="cardDataAgreementPdf"
        :href="cardDataAgreementPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Соглашение о хранении учётных данных владельцы карт
      </a>,
      <a
        v-if="recurrPaymentsAgreementPdf"
        :href="recurrPaymentsAgreementPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Соглашение на применение Рекуррентных платежей
      </a>,
      <a
        v-if="paidSubAgreementPdf"
        :href="paidSubAgreementPdf"
        target="_blank"
        class="underline hover:text-black/30 transition">
        Соглашение на оформление платной подписки
      </a>.
      Подтверждаю, что не являюсь получателем единовременных и/или регулярных денежных выплат, предусмотренных
      Указами Президента РФ. Стоимость услуги {{ $config.sum }} рублей. Оплата производится раз в 30 дней.
      Осознаю, что оплата услуг не гарантирует получение займа.
    </CheckboxPrimary>
  </div>
</template>
