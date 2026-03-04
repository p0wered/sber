<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useCompanys } from '@/components/Companys/companys.ts';
  import { validateNumeric } from '@/utils/validators.ts';
  import InputNumeric from '@/components/Common/Inputs/InputNumeric.vue';
  import ButtonPrimary from '@/components/Common/Buttons/ButtonPrimary.vue';
  import Card from '@/components/Companys/Alt2/Card.vue';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorBlock from "@/components/Companys/ErrorBlock.vue";

  const {
    displayItems,
    clickedOffers,
    handleOfferClick,
    error
  } = useCompanys();

  const terms = [7, 14, 30];

  const loanAmount = ref<number | null>(null);
  const loanTerm = ref<number>(7);
  const showResults = ref(false);
  const isLoading = ref(false);
  const loanAmountError = ref<string>('');
  const searchedAmount = ref<number | null>(null);
  const searchedTerm = ref<number>(7);

  const filteredOffers = computed(() => {
    if (!showResults.value) {
      return [];
    }

    return displayItems.value.filter(item => {
      const maxLoanAmount = Number(item.max_loan.replace(/\D/g, ''));
      if (isNaN(maxLoanAmount) || maxLoanAmount < searchedAmount.value!) {
        return false;
      }

      const maxLoanTerm = Number(item.loan_length_max.replace(/\D/g, ''));
      return !isNaN(maxLoanTerm) && maxLoanTerm >= searchedTerm.value;
    });
  });

  const updateKey = ref(0);

  const validateLoanAmount = (): boolean => {
    if (!loanAmount.value) {
      loanAmountError.value = 'Укажите сумму займа';
      return false;
    }
    const error = validateNumeric(loanAmount.value, 1000, 100000);
    loanAmountError.value = error;
    return !error;
  };

  const selectLoanTerm = (term: number) => {
    loanTerm.value = term;
  };

  const handleSubmit = async () => {
    if (validateLoanAmount()) {
      if (!showResults.value) {
        searchedAmount.value = loanAmount.value;
        searchedTerm.value = loanTerm.value;
        showResults.value = true;
        updateKey.value++;
      } else {
        isLoading.value = true;
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        searchedAmount.value = loanAmount.value;
        searchedTerm.value = loanTerm.value;
        
        isLoading.value = false;
        updateKey.value++;
      }
    }
  };
</script>

<template>
  <div class="min-h-screen max-w-[1340px] mx-auto md:py-16 py-10 px-4">
    <div class="text-center">
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10
        text-primary rounded-full text-sm font-semibold mb-6 w-fit mx-auto">
        <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
        Персональный подбор займа
      </div>

      <div v-if="!showResults">
        <h2 class="text-xl sm:text-2xl font-black text-black mb-2 tracking-tight transition-all">
          Сколько вам нужно?
        </h2>
        <p class="text-lg text-black/60 max-w-2xl mx-auto leading-relaxed mb-8">
          Укажите сумму и срок - мы найдем лучшие условия именно для вас
        </p>
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border
          border-primary/30 rounded-full text-sm font-medium text-primary mb-8">
          Полностью бесплатно • Без скрытых платежей
        </div>
      </div>

      <div
        class="flex bg-white mb-8 rounded-3xl shadow-lg border border-gray-300 mx-auto"
        :class="[
          showResults
            ? 'lg:flex-row flex-col lg:max-w-5xl max-w-lg gap-4 p-3'
            : 'flex-col max-w-md gap-6 p-6 pt-8'
        ]"
      >
        <div class="w-full space-y-2">
          <p
            v-if="!showResults"
            class="text-black/80 text-base font-medium">
            Сумма займа
          </p>
          <div class="relative">
            <p class="absolute md:top-1/5 top-[13px] right-5 text-black/50 font-medium md:text-[24px] text-[22px]">
              ₽
            </p>
            <InputNumeric
              class="!font-bold !rounded-full"
              v-model="loanAmount"
              :min="1000"
              :max="100000"
              :max-length="6"
              :large="true"
              :is-error="!!loanAmountError"
              :error-message="loanAmountError"
            />
          </div>
        </div>
        <div class="w-full space-y-2">
          <p
            v-if="!showResults"
            class="text-black/80 text-base font-medium"
          >
            Срок займа
          </p>
          <div class="w-full h-full flex gap-4">
            <div
              v-for="term in terms"
              :key="term"
              @click="selectLoanTerm(term)"
              :class="[
                'w-full p-4 flex items-center justify-center rounded-xl',
                'font-semibold cursor-pointer transition text-center md:text-base text-sm',
                loanTerm === term
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              ]"
            >
              {{ term }} дней
            </div>
          </div>
        </div>
        <ButtonPrimary
          :label="showResults ? 'Обновить результаты' : 'Подобрать займ'"
          :disabled="isLoading"
          @click="handleSubmit"
        />
      </div>
    </div>

    <div v-if="isLoading && showResults" class="text-center py-12">
      <LoadingSpinner size="64px" class="text-primary" />
      <p class="text-black/70 text-sm mt-8">Подбираем лучшие предложения...</p>
    </div>

    <transition
      v-else
      enter-active-class="transition-opacity duration-500 ease-out"
      leave-active-class="transition-opacity duration-200 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div>
        <div v-if="showResults" :key="updateKey">
          <p class="text-black/70 text-sm text-center mt-8 mb-4">
            Найдено {{ filteredOffers.length }} предложений
          </p>
          <div
            v-if="filteredOffers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <template v-for="item in filteredOffers" :key="item.id">
              <Card
                :offer="item"
                :is-clicked="clickedOffers.has(item.id)"
                @offer-clicked="handleOfferClick"
              />
            </template>
          </div>
          <ErrorBlock
            v-else
            :error="error"
          />
        </div>
      </div>
    </transition>
  </div>
</template>
