<script setup lang="ts">
  import { computed } from 'vue';
  import type { Offer } from '@/components/Companys/companys.ts';
  import { Building2, Check, ExternalLink } from 'lucide-vue-next';
  import { pluralizeDays } from '@/utils/format.ts';
  import ButtonPrimary from '@/components/Common/Buttons/ButtonPrimary.vue';

  interface Props {
    offer: Offer
    isClicked: boolean
    isAnimated?: boolean
  }

  interface Emits {
    (e: 'offer-clicked', offerId: string): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const formatAmount = (amount: string): string => {
    return new Intl.NumberFormat('ru-RU').format(parseInt(amount));
  };

  const formatLoanTerm = (maxDays: string): string => {
    const days = parseInt(maxDays);
    return `${pluralizeDays(days)}`;
  };

  const benefits: string[] = [
    'Без справок о доходах',
    'Моментальное одобрение',
    'Перевод на карту любого банка',
    'Онлайн оформление',
    'Круглосуточное оформление',
    'Выдача на карту',
    'Льготный период',
    'Досрочное погашение',
    'Низкая процентная ставка',
    'Продление займа',
    'Индивидуальные условия',
    'Поддержка 24/7',
    'Без проверки КИ',
    'Без поручителей',
    'Без комиссий',
    'Без визита в офис'
  ];

  const approvalTimes: number[] = [15, 20, 25, 30, 50, 60];

  function hashString(input: string): number {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = Math.imul(31, h) + input.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  }

  const hash = computed(() => hashString(props.offer.id));

  const displayBenefits = computed(() => {
    const start = hash.value % benefits.length;
    return [0, 1, 2].map(i => {
      const idx = (start + i) % benefits.length;
      return benefits[idx];
    });
  });

  const approvalTimeMinutes = computed(() => {
    return approvalTimes[hash.value % approvalTimes.length];
  });

  const handleClick = (): void => {
    emit('offer-clicked', props.offer.id);
    window.open(props.offer.link, '_blank');
  };
</script>

<template>
  <div
    class="bg-white rounded-3xl border border-gray-200 p-5 pb-4 group
    transition-all h-full flex flex-col relative overflow-hidden"
    :class="{'hover:shadow-xl hover:border-primary/50 hover:-translate-y-1' : !isClicked}"
  >
    <div class="flex items-center gap-4 mb-1">
      <a
        :href="!isClicked ? offer.link : undefined"
        class="w-[160px] h-20 px-2 py-2 rounded-xl flex items-center transition
        justify-center mb-3"
        :class="[isClicked
          ? 'border-1 border-gray-200 shadow-none'
          : 'border-2 border-primary shadow-md'
        ]"
      >
        <img
          v-if="offer.logo"
          :src="offer.logo"
          :alt="offer.name"
          class="w-full h-[100%] object-contain rounded-lg"
        >

        <div v-else class="w-full h-24 rounded-lg bg-white/20 flex items-center justify-center">
          <Building2
            class="w-14 h-14 text-primary fill-primary/15"
            :stroke-width="1"
          />
        </div>
      </a>

      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-900 text-lg truncate">
          {{ offer.name }}
        </h3>
        <p class="text-sm text-gray-500">
          Персональное предложение
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
      <div  class="text-center">
        <div class="text-xs text-gray-500 mb-1">Сумма займа</div>
        <div class="text-[18px] font-black text-black">
          {{ formatAmount(offer.max_loan) }} ₽
        </div>
      </div>

      <div class="text-center">
        <div class="text-xs text-gray-500 mb-1">Ставка в день</div>
        <div class="text-[18px] font-black text-black">
          {{ offer.percentage }} %
        </div>
      </div>

      <div class="text-center">
        <div class="text-xs text-gray-500 mb-1">Макс. срок</div>
        <div class="text-[18px] font-bold text-black">
          {{ formatLoanTerm(offer.loan_length_max) }}
        </div>
      </div>

      <div class="text-center">
        <div class="text-xs text-gray-500 mb-1">Одобрение</div>
        <div class="text-[18px] font-bold text-black">
          {{ approvalTimeMinutes }} мин
        </div>
      </div>
    </div>

    <div class="space-y-3 my-4">
      <div
        v-for="(benefit, idx) in displayBenefits"
        :key="idx"
        class="flex items-center gap-3 text-sm ml-1"
      >
        <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
          <Check class="w-3 h-3 text-primary" />
        </div>
        <span class="text-black/90 font-medium">
          {{ benefit }}
        </span>
      </div>
    </div>

    <ButtonPrimary
      v-if="!isClicked"
      @click="handleClick"
      label="Получить займ"
      :icon="ExternalLink"
      class="!rounded-xl"
    />

    <ButtonPrimary
      v-else
      label="Просмотрено"
      :disabled="true"
      class="!bg-gray-300 !cursor-not-allowed !rounded-xl"
    />

    <p class="text-sm text-center text-black/60 mt-3">
      Возраст от {{ offer.approved_age_min }} до {{ offer.approved_age_max }} лет • Без справок
    </p>
  </div>
</template>