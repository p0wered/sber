<script setup lang="ts">
  import type { Offer } from '@/components/Companys/companys.ts';
  import { ChevronRight } from 'lucide-vue-next';

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
  
  const handleClick = (): void => {
    emit('offer-clicked', props.offer.id);
    window.open(props.offer.link, '_blank');
  };
</script>

<template>
  <div
    @click="!isClicked ? handleClick() : null"
    class="bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 transition-all
    h-full flex flex-col relative overflow-hidden opacity-60 select-none grayscale-70"
    :class="
      {'hover:shadow-xl hover:border-primary hover:scale-102 opacity-100 cursor-pointer !grayscale-0' : !isClicked}
    "
  >
    <div class="flex items-start justify-between mb-0 sm:mb-2">
      <div class="h-12 w-32 md:w-46 p-1 flex items-center">
        <img
          v-if="offer.logo"
          :src="offer.logo"
          :alt="offer.name"
          class="max-h-full max-w-full object-contain"
        >
      </div>

      <ChevronRight
        class="w-10 h-10 text-gray-400 flex-shrink-0"
        :stroke-width="1"
      />
    </div>

    <div
      class="w-full flex flex-wrap gap-1 justify-center text-center text-xs sm:text-sm
      bg-primary/10 rounded-lg px-1 md:px-3 py-1 mb-2 sm:mb-3 tracking-tight">
      <p class="font-medium sm:font-bold text-primary">
        Процентная ставка
      </p>
      <p class="font-medium sm:font-bold text-primary">
        {{ offer.percentage }}%
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <div
        class="w-full px-1 sm:px-3 sm:py-1.5 sm:border sm:border-gray-200/80
        rounded-lg text-md gap-1 flex flex-row sm:flex-col items-center
        sm:items-start justify-start flex-wrap"
      >
        <p class="text-sm">
          Лимит
        </p>
        <p class="text-sm sm:text-md font-bold tracking-tighter">
          до {{ formatAmount(offer.max_loan) }} ₽
        </p>
      </div>

      <div
        class="w-full px-1 sm:px-3 sm:py-1.5 sm:border sm:border-gray-200/80
        rounded-lg text-md gap-1 flex flex-row sm:flex-col items-center
        sm:items-start justify-start flex-wrap"
      >
        <p class="text-sm">
          Возраст
        </p>
        <p class="text-sm sm:text-md font-bold tracking-tighter">
          {{ offer.approved_age_min }} - {{ offer.approved_age_max }} лет
        </p>
      </div>
    </div>
  </div>
</template>