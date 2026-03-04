<script setup lang="ts">
  import { onMounted, watch } from 'vue';
  import { useStepLocalStorage } from '@/utils/anketa.ts';
  import { useValidation } from '@/utils/use-validation.ts';
  import { Undo2 } from 'lucide-vue-next';
  import {
    validateBirthdayDate,
    validateFullName,
    validateGender
  } from '@/utils/validators.ts';
  import InputFullName from "@/components/Common/Inputs/InputFullName.vue";
  import InputDate from "@/components/Common/Inputs/InputDate.vue";
  import CheckboxRadio from "@/components/Common/Checkboxes/CheckboxRadio.vue";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonIcon from '@/components/Common/Buttons/ButtonIcon.vue';

  interface StepTwoFormData {
    fullName: string;
    birthdayDate: string;
    gender: string;
  }

  const props = defineProps<{
    formData: StepTwoFormData;
    isLoading: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'submit-step'): void;
    (e: 'prev-step'): void;
    (e: 'update:formData', value: StepTwoFormData): void;
  }>();

  const genderOptions = [
    { label: 'Мужчина', value: 'm' },
    { label: 'Женщина', value: 'f' }
  ];

  const {
    errors,
    validateFieldOnBlur,
    clearField,
    setFieldError,
    validateAll
  } = useValidation(props.formData, {
    fullName: validateFullName,
    birthdayDate: validateBirthdayDate,
    gender: validateGender
  });

  const localStorageKeys = {
    fullName: 'full_name',
    birthdayDate: 'birthday',
    gender: 'gender'
  } as const;

  const { loadData, saveData } = useStepLocalStorage(
    props.formData,
    localStorageKeys as unknown as Record<keyof StepTwoFormData, string>,
    emit,
    {
      load: {
        gender: (value: string) => {
          const genderFound = genderOptions.some(opt => opt.value === value);
          return genderFound ? value : '';
        }
      },
      save: {
        fullName: (value: string) => {
          const parts = value.trim().split(/\s+/).filter(Boolean);

          const nameParts: Record<string, string> = {
            last_name: parts[0] || '',
            first_name: parts[1] || '',
            patronymic: parts.length > 2 ? parts.slice(2).join(' ') : ''
          };

          Object.entries(nameParts).forEach(([key, val]) => {
            if (val) {
              localStorage.setItem(key, val);
            } else {
              localStorage.removeItem(key);
            }
          });

          return value;
        }
      }
    }
  );

  onMounted(() => {
    const hasLoadedFromStorage = Object.keys(localStorageKeys).some(key => {
      return localStorage.getItem(localStorageKeys[key as keyof typeof localStorageKeys]);
    });

    if (hasLoadedFromStorage) {
      loadData();
    }

    if (hasLoadedFromStorage) {
      emit('update:formData', props.formData);
    }
  });

  watch(() => props.formData, (newFormData) => {
    saveData(newFormData);
  }, { deep: true });

  const validateStep = () => {
    return validateAll();
  };

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
  <div class="w-full space-y-6 mb-6">
    <InputFullName
      v-model="props.formData.fullName"
      :is-error="!!errors.fullName"
      :error-message="errors.fullName"
      @blur="validateFieldOnBlur('fullName')"
      @input="clearField('fullName')"
      @wrong-layout="setFieldError('fullName', 'Переключите раскладку')"
      @gender-detected="(gender: string) => {
        props.formData.gender = gender; clearField('gender');
      }"
    />

    <InputDate
      v-model="props.formData.birthdayDate"
      label="Дата рождения"
      :is-error="!!errors.birthdayDate"
      :error-message="errors.birthdayDate"
      @blur="validateFieldOnBlur('birthdayDate')"
      @input="clearField('birthdayDate')"
    />

    <CheckboxRadio
      v-model="props.formData.gender"
      :options="genderOptions"
      name="gender"
      :is-error="!!errors.gender"
      @change="clearField('gender')"
    />
  </div>

  <div class="flex gap-3 mt-3">
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
