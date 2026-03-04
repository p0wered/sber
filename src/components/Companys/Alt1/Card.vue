<script setup lang="ts">
  import { computed } from 'vue';
  import type { Offer } from '@/components/Companys/companys.ts';
  import { Building2, ExternalLink } from 'lucide-vue-next';
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
    return `до ${pluralizeDays(days)}`;
  };

  const approvalTimes: number[] = [15, 20, 25, 30, 50, 60];

  function hashString(input: string): number {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = Math.imul(31, h) + input.charCodeAt(i) | 0;
    }
    return Math.abs(h);
  }

  const hash = computed(() => hashString(props.offer.id));

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
    class="bg-white rounded-3xl border border-gray-200 p-4 group
    transition-all h-full flex flex-col relative overflow-hidden"
    :class="{'hover:shadow-xl hover:border-primary/50 hover:-translate-y-1' : !isClicked}"
  >
    <a
      :href="!isClicked ? offer.link : undefined"
      class="w-full h-24 px-6 py-1.5 rounded-xl flex items-center transition
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

    <div class="grid grid-cols-2 gap-2 mb-2">
      <div class="w-full bg-gray-100 rounded-lg p-2.5">
        <div class="text-xs text-gray-500 mb-1">Сумма займа</div>
        <div class="text-base font-bold text-black">
          {{ formatAmount(offer.max_loan) }} ₽
        </div>
      </div>

      <div class="bg-primary/10 rounded-lg p-2.5">
        <div class="text-xs text-primary mb-1">Ставка в день</div>
        <div class="text-base font-bold text-primary">
          {{ offer.percentage }} %
        </div>
      </div>

      <div class="bg-gray-100 rounded-lg p-2.5">
        <div class="text-xs text-gray-500 mb-1">Срок</div>
        <div class="text-base font-bold text-black">
          {{ formatLoanTerm(offer.loan_length_max) }}
        </div>
      </div>

      <div class="bg-primary/10 rounded-lg p-2.5">
        <div class="text-xs text-primary mb-1">Одобрение</div>
        <div class="text-base font-bold text-primary">
          {{ approvalTimeMinutes }} мин
        </div>
      </div>
    </div>

    <div class="p-2 bg-gray-100 rounded-lg mb-3">
      <p class="text-xs text-center text-black font-medium">
        Возраст от {{ offer.approved_age_min }} до {{ offer.approved_age_max }} лет
      </p>
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
  </div>
</template>