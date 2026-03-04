<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useUtmSource } from "@/utils/common.ts";
  import { validateEmail, validateEmailDomain, validatePhone } from '@/utils/validators.ts';
  import { useStepLocalStorage } from '@/utils/anketa.ts';
  import { useValidation } from '@/utils/use-validation.ts';
  import InputPhone from "@/components/Common/Inputs/InputPhone.vue";
  import UserAgreement from "@/components/Anketa/UserAgreement.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import InputEmail from '@/components/Common/Inputs/InputEmail.vue';

  interface StepOneFormData {
    phone: string;
    email: string;
    userAgreementOne: boolean;
    userAgreementTwo: boolean;
  }

  const props = defineProps<{
    formData: StepOneFormData;
    isLoading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit-step'): void;
    (e: 'update:formData', value: StepOneFormData): void;
  }>();

  const { hasUtmSource } = useUtmSource();

  const { 
    errors, 
    validateFieldOnBlur, 
    clearField, 
    validateAll, 
    setFieldError 
  } = useValidation(props.formData, {
    phone: validatePhone,
    email: validateEmail
  });
  
  const agreementOneError = ref('');
  const agreementTwoError = ref('');
  const isDomainChecking = ref(false);

  const localStorageKeys: Record<keyof StepOneFormData, string> = {
    phone: 'phone',
    email: 'email',
    userAgreementOne: 'isChecked1',
    userAgreementTwo: 'isChecked2'
  };

  const { loadData, saveData } = useStepLocalStorage(
    props.formData,
    localStorageKeys,
    emit,
    {
      load: {
        userAgreementOne: (value: string) => value === 'true',
        userAgreementTwo: (value: string) => value === 'true'
      },
      save: {
        userAgreementOne: (value: boolean) => String(value),
        userAgreementTwo: (value: boolean) => String(value)
      }
    }
  );

  loadData();

  watch(() => props.formData, (newFormData) => {
    saveData(newFormData);
  }, { deep: true });

  const validateAgreement = (
    value: boolean, 
    errorRef: typeof agreementOneError, 
    message = 'Вы должны принять все условия'
  ): boolean => {
    if (!value) {
      errorRef.value = message;
      return false;
    }
    errorRef.value = '';
    return true;
  };

  const validateStep = () => {
    let isValid = validateAll();
    
    isValid = validateAgreement(props.formData.userAgreementOne, agreementOneError) && isValid;
    
    if (!hasUtmSource.value) {
      isValid = validateAgreement(props.formData.userAgreementTwo, agreementTwoError) && isValid;
    } else {
      agreementTwoError.value = '';
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      isDomainChecking.value = true;
      try {
        const domainCheckResult = await validateEmailDomain(props.formData.email);
        if (!domainCheckResult.isValid) {
          setFieldError('email', domainCheckResult.message);
          return;
        }
        
        emit('submit-step');
      } finally {
        isDomainChecking.value = false;
      }
    }
  };

  const clearAgreementOneError = () => {
    agreementOneError.value = '';
  };

  const clearAgreementTwoError = () => {
    agreementTwoError.value = '';
  };
</script>

<template>
  <div class="space-y-6">
    <InputPhone
      v-model="props.formData.phone"
      :save-on-change="false"
      :is-error="!!errors.phone"
      :error-message="errors.phone"
      :show-operator="true"
      @blur="validateFieldOnBlur('phone')"
      @input="clearField('phone')"
    />

    <InputEmail
      v-model="props.formData.email"
      :is-error="!!errors.email"
      :error-message="errors.email"
      @blur="validateFieldOnBlur('email')"
      @input="clearField('email')"
    />

    <UserAgreement
      v-model:checkboxOne="props.formData.userAgreementOne"
      v-model:checkboxTwo="props.formData.userAgreementTwo"
      :is-error-one="!!agreementOneError"
      :is-error-two="!!agreementTwoError"
      @update:checkboxOne="clearAgreementOneError"
      @update:checkboxTwo="clearAgreementTwoError"
      :show-second-checkbox="!hasUtmSource"
    />
  </div>

  <p v-if="!!agreementOneError || (!hasUtmSource && !!agreementTwoError)" class="text-red-600 text-xs mt-2">
    {{ agreementOneError || agreementTwoError }}
  </p>

  <div class="flex flex-col gap-6 mt-3">
    <ButtonPrimary
      label="Продолжить"
      :is-loading="isLoading || isDomainChecking"
      @click="handleSubmit"
    />
  </div>
</template>