<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { useRouter } from "vue-router";
  import { formatCurrency } from '@/utils/format.ts';
  import { createDefaultCalculations, saveCalculations } from '@/utils/session.ts';
  import { navigateToApply } from '@/utils/common.ts';
  import { BadgeRussianRuble, ClockFading } from "lucide-vue-next";
  import Slider from '@/components/Slider.vue';
  import ButtonPrimary from '@/components/Common/Buttons/ButtonPrimary.vue';

  const { small } = defineProps<{
    small?: boolean;
  }>();

  const router = useRouter();
  const { amount, period } = createDefaultCalculations();
  const loanAmount = ref(amount);
  const loanPeriod = ref(period);
  const isWeeksPeriod = computed(() => loanAmount.value >= 50000);

  const decisionTime = computed(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 10);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  });

  const LOAN_PERIOD_SLIDER_MIN = 1;
  const LOAN_PERIOD_SLIDER_MAX = 90;

  const loanAmountFormatted = computed(() =>
      formatCurrency(loanAmount.value)
  );

  const loanPeriodFormatted = computed(() => {
    return `${loanPeriod.value} ${loanPeriod.value === 1 ? 'день' : loanPeriod.value < 5 ? 'дня' : 'дней'}`;
  });

  const updateSavedCalculations = () => {
    const totalDays = loanPeriod.value;
    saveCalculations(loanAmount.value, totalDays, isWeeksPeriod.value);
  };

  watch([loanAmount, loanPeriod], () => {
    updateSavedCalculations();
  }, { immediate: true });
</script>

<template>
  <div
    data-aos="fade-up"
    data-aos-delay="50"
    class="bg-white p-5 lg:p-4 lg:pl-6 rounded-3xl border border-gray-200 w-full relative z-10"
  >
    <div class="flex md:hidden justify-center gap-2 mb-5">
      <BadgeRussianRuble class="text-primary"/>
      <h2 class="font-medium text-center">
        Рассчитайте условия
      </h2>
    </div>

    <div
      :class="[
        small ? 'flex flex-col sm:flex-row gap-0 sm:gap-10' : 'flex flex-col lg:flex-row gap-8'
      ]"
    >
      <Slider
        class="w-full"
        :min="1000"
        :max="100000"
        :step="1000"
        v-model="loanAmount"
        label="Сумма займа"
        type="amount"
        @change="updateSavedCalculations">
        {{loanAmountFormatted}}
      </Slider>

      <Slider
        class="w-full"
        :min="LOAN_PERIOD_SLIDER_MIN"
        :max="LOAN_PERIOD_SLIDER_MAX"
        :step="1"
        label="Срок займа"
        type="period"
        v-model="loanPeriod"
        @change="updateSavedCalculations">
        {{loanPeriodFormatted}}
      </Slider>

      <ButtonPrimary
        class="lg:max-w-64 !md:text-lg"
        label="Оформить заявку"
        @click="() => navigateToApply(router)"
      />
    </div>
  </div>

  <div
    data-aos="fade-up"
    data-aos-delay="100"
    class="flex gap-4 xs:gap-3 items-center w-fit mx-auto bg-white text-center p-3
    xs:py-2.5 xs:px-4 rounded-2xl lg:rounded-full border border-gray-200 mt-2"
  >
    <ClockFading
      class="hidden xs:block rounded-xl w-5 h-5 text-primary"
    />
    <p class="text-center text-xs md:text-sm text-black/85">
      Оформите заявку сейчас и получите решение уже в {{ decisionTime }}
    </p>
  </div>
</template>