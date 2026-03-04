<script setup lang="ts">
  import { onMounted, watch } from 'vue';
  import { useStepLocalStorage } from '@/utils/anketa.ts';
  import { useValidation } from '@/utils/use-validation.ts';
  import { Undo2 } from 'lucide-vue-next';
  import {
    validateIssueDate,
    validatePassportSeriesAndNumber,
    validateSubdivisionCode
  } from '@/utils/validators.ts';
  import InputPassport from "@/components/Common/Inputs/InputPassport.vue";
  import InputDate from "@/components/Common/Inputs/InputDate.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonIcon from '@/components/Common/Buttons/ButtonIcon.vue';

  interface StepThreeFormData {
    seriesAndNumber: string;
    subdivisionCode: string;
    issueDate: string;
  }

  const props = defineProps<{
    formData: StepThreeFormData;
    isLoading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit-step'): void;
    (e: 'prev-step'): void;
    (e: 'update:formData', value: StepThreeFormData): void;
  }>();

  const { errors, validateFieldOnBlur, clearField, validateAll } = useValidation(props.formData, {
    seriesAndNumber: validatePassportSeriesAndNumber,
    subdivisionCode: validateSubdivisionCode,
    issueDate: validateIssueDate
  });

  const localStorageKeys: Record<keyof StepThreeFormData, string> = {
    seriesAndNumber: 'passportData',
    subdivisionCode: 'passportDepCode',
    issueDate: 'passportIssueDate'
  };

  const { loadData, saveData } = useStepLocalStorage(
    props.formData,
    localStorageKeys,
    emit
  );

  onMounted(() => {
    loadData();
  });

  watch(() => props.formData, (newFormData) => {
    saveData(newFormData);
  }, { deep: true });

  const validateStep = () => validateAll();

  const handleSubmit = () => {
    if (validateStep()) {
      emit('submit-step');
    }
  };

  const handlePrev = () => {
    emit('prev-step');
  };
</script>

<template>
  <div class="space-y-6">
    <InputPassport
      v-model="props.formData.seriesAndNumber"
      :is-error="!!errors.seriesAndNumber"
      :error-message="errors.seriesAndNumber"
      @blur="validateFieldOnBlur('seriesAndNumber')"
      @input="clearField('seriesAndNumber')"
    />
    <InputPassport
      v-model="props.formData.subdivisionCode"
      :division-code="true"
      :is-error="!!errors.subdivisionCode"
      :error-message="errors.subdivisionCode"
      @blur="validateFieldOnBlur('subdivisionCode')"
      @input="clearField('subdivisionCode')"
    />
    <InputDate
      v-model="props.formData.issueDate"
      label="Дата выдачи"
      :is-error="!!errors.issueDate"
      :error-message="errors.issueDate"
      @blur="validateFieldOnBlur('issueDate')"
      @input="clearField('issueDate')"
    />
  </div>

  <div class="flex gap-3 mt-11">
    <ButtonIcon
      :icon="Undo2"
      :is-loading="isLoading"
      @click="handlePrev"
    />
    <ButtonPrimary
      label="Продолжить"
      :is-loading="isLoading"
      @click="handleSubmit"
    />
  </div>
</template>