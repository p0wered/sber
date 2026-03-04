<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { Settings2, X } from 'lucide-vue-next';
  import Slider from '@/components/Slider.vue';
  import { formatCurrency } from '@/utils/format.ts';
  import { saveCalculations } from '@/utils/session.ts';
  import { getLoanData } from '@/utils/common.ts';

  const props = defineProps<{
    amount?: number;
    period?: number
    editable?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update-loan', payload: { amount: number; period: number }): void;
  }>();

  const isExpanded = ref(false);

  const loanAmount = ref(25000);
  const loanPeriodIndex = ref(10);

  const loanAmountFormatted = computed(() => formatCurrency(loanAmount.value));
  const loanPeriodFormatted = computed(() => {
    // eslint-disable-next-line max-len
    return `${loanPeriodIndex.value} ${loanPeriodIndex.value === 1 ? 'день' : loanPeriodIndex.value < 5 ? 'дня' : 'дней'}`;
  });
  const isWeeksPeriod = computed(() => loanAmount.value >= 50000);

  const updateSavedCalculations = () => {
    const periodDays = loanPeriodIndex.value;
    saveCalculations(loanAmount.value, periodDays, isWeeksPeriod.value);
    emit('update-loan', { amount: loanAmount.value, period: periodDays });
  };

  onMounted(() => {
    if (props.amount !== undefined && props.period !== undefined) {
      loanAmount.value = props.amount;
      loanPeriodIndex.value = props.period;
    } else {
      const { amount, period } = getLoanData();
      loanAmount.value = amount;
      loanPeriodIndex.value = period;
    }
  });

  watch(() => [props.amount, props.period] as const, ([a, p]) => {
    if (a !== undefined) loanAmount.value = a;
    if (p !== undefined) loanPeriodIndex.value = p;
  });

  watch([loanAmount, loanPeriodIndex], () => {
    updateSavedCalculations();
  });
</script>

<template>
  <div
    class="md:px-6 px-4 md:pb-0 bg-secondary/40 border border-gray-200 rounded-xl
    flex flex-col gap-4 transition-all h-fit overflow-hidden mb-6"
  >
    <div
      class="flex items-start justify-between gap-3 transition-all"
      :class="props.editable
        ? 'opacity-100 max-h-unset md:mt-6 mt-4'
        : 'opacity-0 max-h-0 mt-0'"
    >
      <p class="font-semibold text-black md:text-[22px] text-lg">
        Вы оформляете
      </p>
      <button
        @click="isExpanded = !isExpanded"
        class="text-sm text-primary font-medium bg-white
        p-1 rounded-md cursor-pointer transition-all w-9 h-9
        hover:bg-primary hover:text-white hover:border-primary
        flex items-center justify-center border border-gray-200">
        <component :is="isExpanded ? X : Settings2" :key="isExpanded"/>
      </button>
    </div>

    <div
      class="flex justify-between transition-all"
      :class="props.editable ? 'mt-3' : 'mt-0'"
    >
      <div class="w-fit">
        <p class="text-neutral-500 md:text-base text-xs">Сумма</p>
        <p class="text-black font-semibold md:text-[22px] text-lg w-max">
          {{ loanAmountFormatted }}
        </p>
      </div>

      <div class="w-fit">
        <p class="text-neutral-500 md:text-base text-xs">Срок</p>
        <p class="text-black font-semibold md:text-[22px] text-lg w-max">
          {{ loanPeriodFormatted }}
        </p>
      </div>

      <div class="w-fit">
        <p class="text-neutral-500 md:text-base text-xs">Ставка</p>
        <p class="text-black font-semibold md:text-[22px] text-lg w-max">
          от 0%
        </p>
      </div>
    </div>

    <div
      class="space-y-6 transition-[max-height,opacity,margin] duration-300 ease-in-out"
      :class="isExpanded && props.editable ? 'opacity-100 max-h-[520px] mb-6 mt-4' : 'opacity-0 max-h-0'"
    >
      <Slider
        :min="1000"
        :max="100000"
        :step="1000"
        v-model="loanAmount"
        label="Сумма"
        type="amount"
        @change="updateSavedCalculations">
        {{ loanAmountFormatted }}
      </Slider>

      <Slider
        :min="1"
        :max="90"
        :step="1"
        v-model="loanPeriodIndex"
        label="Срок"
        type="period"
        @change="updateSavedCalculations">
        {{ loanPeriodFormatted }}
      </Slider>
    </div>
  </div>
  
</template>

