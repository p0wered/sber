<script setup lang="ts">
  import { computed, onMounted, reactive, ref, watch } from "vue";
  import { getCookie, getFullNameParts, getLoanData, useUtmSource } from '@/utils/common.ts';
  import { saveCalculations } from '@/utils/session';
  import { config } from "@/config.ts";
  import axios from "axios";
  import AnketaProgress from "@/components/Anketa/AnketaProgress.vue";
  import ContactInfo from "@/components/Anketa/Steps/ContactInfo.vue";
  import UserData from "@/components/Anketa/Steps/UserData.vue";
  import PassData from "@/components/Anketa/Steps/PassData.vue";
  import DataVerification from "@/components/Anketa/Steps/DataVerification.vue";
  import PaymentForm from "@/components/Anketa/Steps/PaymentForm.vue";
  import AgreementPopup from "@/components/Anketa/AgreementPopup.vue";
  import PhoneVerification from "@/components/PhoneVerification/PhoneVerification.vue";
  import LoanChanger from '@/components/LoanChanger.vue';

  const appStateKeys = {
    step: 'currentAnketaStep'
  } as const;

  const stepTwoFields = [
    'first_name', 'last_name', 'patronymic', 'birthday', 'gender'
  ] as const;

  const stepThreeFields = [
    'passportData', 'passportDepCode', 'passportDateIssue'
  ] as const;

  const cookieParams = [
    'sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7', 'click_id', 'tr_click_id', 'web_id'
  ] as const;

  const stepComponents: Record<number, string> = {
    1: 'ContactInfo',
    2: 'UserData',
    3: 'PassData',
    4: 'DataVerification',
    5: 'PaymentForm'
  };

  const { hasUtmSource } = useUtmSource();
  const isLoading = ref(false);
  const step = ref(1);
  const currentStepComponent = computed(() => stepComponents[step.value] ?? null);

  const showAgreementPopup = ref(false);
  const agreementAccepted = ref(false);
  const showPhoneVerification = ref(false);
  const phoneVerified = ref(false);

  let formData = reactive({
    phone: '',
    userAgreementOne: false,
    userAgreementTwo: false,
    fullName: '',
    lastName: '',
    firstName: '',
    patronymic: '',
    birthdayDate: '',
    email: '',
    gender: '',
    loanAmount: 50000,
    loanPeriod: 30,
    seriesAndNumber: '',
    subdivisionCode: '',
    issueDate: '',
    lead_id: ''
  });

  const apiClient = axios.create({
    baseURL: `https://api.mfo-0.ru/`,
    timeout: 10000,
    params: {
      site_id: config.siteId
    }
  });

  interface ApiResponse {
    status: string;
    status_code: number;
    lead_id: string;
  }

  const isEarlyStep = computed(() =>
      (step.value <= 1 && hasUtmSource.value) || step.value <= 3
  );

  const createFormData = (additionalFields: Record<string, string> = {}) => {
    const requestFormData = new FormData();
    const loanData = getLoanData();

    const baseFields: Record<string, string | null> = {
      agreement_time: getCookie('agreement_time'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezone_offset: String(-new Date().getTimezoneOffset() / 60),
      source: getCookie('utm_source'),
      email: formData.email,
      loan_sum: String(loanData.amount),
      loan_length: String(loanData.period),
      ...additionalFields
    };

    if (hasUtmSource.value) {
      baseFields.phone = formData.phone;
    }

    if (formData.lead_id) {
      baseFields.lead_id = formData.lead_id;
    }

    Object.entries(baseFields).forEach(([key, value]) => {
      if (value) requestFormData.append(key, value);
    });

    cookieParams.forEach(key => {
      const value = getCookie(key);
      if (value) requestFormData.append(key, value);
    });

    return requestFormData;
  };

  const appendAllAvailableFields = (formData: FormData) => {
    appendNameFieldsFromFullName(formData);

    const nameKeys = new Set(['first_name', 'last_name', 'patronymic']);
    stepTwoFields.forEach(key => {
      if (nameKeys.has(key)) return;
      const value = localStorage.getItem(key);
      if (value) {
        formData.append(key, value);
      }
    });

    stepThreeFields.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        formData.append(key, value);
      }
    });

    const passportSeriesAndNumber = localStorage.getItem('passportData') || '';
    const [passportSeries, passportNumber] = passportSeriesAndNumber.split(' ').filter(Boolean);

    if (passportSeries && passportNumber) {
      formData.append('passportSeries', passportSeries);
      formData.append('passportNumber', passportNumber);
    }

    const passportDepCode = localStorage.getItem('passportDepCode');
    const passportIssueDate = localStorage.getItem('passportIssueDate');

    if (passportDepCode) formData.append('passportDepCode', passportDepCode);
    if (passportIssueDate) formData.append('passport_issued_date', passportIssueDate);
  };

  const appendNameFieldsFromFullName = (formData: FormData) => {
    const { lastName, firstName, patronymic } = getFullNameParts();

    if (!lastName && !firstName && !patronymic) return;

    if (lastName) formData.append('last_name', lastName);
    if (firstName) formData.append('first_name', firstName);
    if (patronymic) formData.append('patronymic', patronymic);
  };

  const sendApiRequest = async (
      formData: FormData,
      endpoint: string,
      stepNumber: number
  ) => {
    try {
      const response = await apiClient.post<ApiResponse>(endpoint, formData);

      const data = response.data;
      if (data.status !== 'success') {
        throw new Error(
            `API вернул ошибку на шаге ${stepNumber}: ${JSON.stringify(data)}`
        );
      }

      return data;
    } catch (err: any) {
      const message = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      throw new Error(message);
    }
  };

  const sendStepOneRequest = async () => {
    const requestFormData = createFormData();
    appendAllAvailableFields(requestFormData);

    const responseData = await sendApiRequest(requestFormData, 'new-user', 1);

    if (responseData.lead_id) {
      localStorage.setItem('lead_id', responseData.lead_id);
      formData.lead_id = responseData.lead_id;
      return { success: true, message: 'Шаг 1 успешно обработан', lead_id: responseData.lead_id };
    }

    throw new Error('lead_id не получен от API');
  };

  const sendStepTwoRequest = async () => {
    if (!localStorage.getItem('lead_id')) {
      step.value = 1;
      throw new Error('lead_id отсутствует. Невозможно отправить запрос шага 2.');
    }

    const requestFormData = createFormData();
    appendAllAvailableFields(requestFormData);

    await sendApiRequest(requestFormData, 'add', 2);
    return { success: true, message: 'Шаг 2 успешно обработан' };
  };

  const sendStepThreeRequest = async () => {
    if (!localStorage.getItem('lead_id')) {
      step.value = 1;
      throw new Error('lead_id отсутствует. Невозможно отправить запрос шага 3.');
    }

    const requestFormData = createFormData();
    appendAllAvailableFields(requestFormData);

    await sendApiRequest(requestFormData, 'add', 3);
    return { success: true, message: 'Шаг 3 успешно обработан' };
  };

  const handleStepSubmit = async () => {
    isLoading.value = true;

    try {
      const stepHandlers = {
        1: sendStepOneRequest,
        2: sendStepTwoRequest,
        3: sendStepThreeRequest
      };

      const handler = stepHandlers[step.value as keyof typeof stepHandlers];
      if (handler) {
        await handler();

        if (step.value === 1 && hasUtmSource.value) {
          step.value = 4;
        } else {
          step.value++;
        }
      }
    } catch (error) {
      console.error('Ошибка при отправке данных,', error);
      alert('Произошла ошибка при отправке данных. Пожалуйста, попробуйте еще раз.');
    } finally {
      isLoading.value = false;
    }
  };

  const handleAgreementAccept = () => {
    agreementAccepted.value = true;
    showAgreementPopup.value = false;
    showPhoneVerification.value = true;
  };

  const phoneVerificationComplete = async () => {
    showPhoneVerification.value = false;
    phoneVerified.value = true;

    if (!hasUtmSource.value && formData.lead_id) {
      try {
        const requestFormData = createFormData();
        await sendApiRequest(requestFormData, 'add', 1);
      } catch (error) {
        console.error('Ошибка при отправки телефона:', error);
      }
    }
  };

  onMounted(() => {
    const loanData = getLoanData();
    formData.loanAmount = loanData.amount;
    formData.loanPeriod = loanData.period;

    const isPaymentRetry = sessionStorage.getItem('payment_retry_redirect');
    if (isPaymentRetry) {
      sessionStorage.removeItem('payment_retry_redirect');
      step.value = 5;
      return;
    }

    if (!formData.lead_id) {
      const savedLeadId = localStorage.getItem('lead_id');
      if (savedLeadId) {
        formData.lead_id = savedLeadId;
      }
    }

    if (hasUtmSource.value) {
      step.value = 1;
    } else {
      const savedStep = localStorage.getItem(appStateKeys.step);
      if (savedStep) {
        const parsedStep = parseInt(savedStep, 10);
        step.value = Number.isNaN(parsedStep) ? 1 : Math.min(parsedStep, 3);
      }
    }
  });

  watch(() => [formData.loanAmount, formData.loanPeriod] as const, ([amount, period]) => {
    const isWeeklyPeriod = amount >= 50000;
    saveCalculations(amount, period, isWeeklyPeriod);
  }, { deep: false });

  watch(step, (newStep) => {
    localStorage.setItem(appStateKeys.step, String(newStep));

    const isDataVerificationStep = currentStepComponent.value === 'DataVerification';
    const shouldShowAgreement = isDataVerificationStep && !hasUtmSource.value;

    showAgreementPopup.value = shouldShowAgreement;
    agreementAccepted.value = !shouldShowAgreement;
    phoneVerified.value = !shouldShowAgreement;
  });
</script>

<template>
  <div class="min-h-[calc(100dvh-64px)] h-full md:bg-transparent bg-white">
    <div
      class="md:p-8 p-4 md:my-6 my-0 md:rounded-3xl md:border border-gray-200
      md:max-w-[620px] mx-auto bg-white h-full"
      data-aos="fade-in"
    >
      <LoanChanger
        :amount="formData.loanAmount"
        :period="formData.loanPeriod"
        :editable="isEarlyStep"
        @update-loan="(p) => {
          formData.loanAmount = p.amount;
          formData.loanPeriod = p.period;
        }"
      />

      <AnketaProgress
        v-if="isEarlyStep"
        :step="step"
        :shortAnketa="hasUtmSource"
      />

      <ContactInfo
        v-if="currentStepComponent === 'ContactInfo'"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
      />

      <UserData
        v-else-if="currentStepComponent === 'UserData'"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="step--"
      />

      <PassData
        v-else-if="currentStepComponent === 'PassData'"
        v-model:form-data="formData"
        :is-loading="isLoading"
        @submit-step="handleStepSubmit"
        @prev-step="step--"
      />

      <DataVerification
        v-else-if="currentStepComponent === 'DataVerification'"
        :start-verification="agreementAccepted && phoneVerified"
        @verification-complete="step++"
      />

      <PaymentForm
        v-else-if="currentStepComponent === 'PaymentForm'"
        :loan-amount="formData.loanAmount"
        :loan-period="formData.loanPeriod"
      />
    </div>
  </div>
  
  <AgreementPopup
    :show="showAgreementPopup"
    @accept="handleAgreementAccept"
  />

  <PhoneVerification
    :show="showPhoneVerification"
    @phone-verified="phoneVerificationComplete"
  />
</template>