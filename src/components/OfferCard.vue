<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { getCookie, setCookie } from '@/utils/common';
  import { formatNumber } from '@/utils/format';

  interface OfferData {
    logo: string;
    name: string;
    max_loan: string;
    percentage: string;
    loan_length_max: string;
    approved_age_min: string;
    link: string;
  }

  interface Props {
    offer: OfferData;
    index: number;
    totalOffers: number;
  }

  const props = defineProps<Props>();
  const approvalRates = [99, 98, 96, 95, 94, 93, 91, 90, 89, 87, 86, 85];
  const isVisited = ref(false);
  const isFirstNotVisited = ref(false);
  const buttonText = computed(() => isVisited.value ? 'Просмотрено' : 'Получить деньги');
  const approvalRate = computed(() => approvalRates[props.index % approvalRates.length]);

  const getVisitedOffers = (): Record<string, number> => {
    const cookie = getCookie('visitedOffers');
    return cookie ? JSON.parse(cookie) : {};
  };

  const markAsVisited = () => {
    const visited = getVisitedOffers();
    visited[props.index] = props.index;
    setCookie('visitedOffers', JSON.stringify(visited), 7);
  };

  const checkVisitedStatus = () => {
    const visited = getVisitedOffers();
    const notVisitedIndexes: number[] = [];

    for (let i = 0; i < props.totalOffers; i++) {
      if (!visited.hasOwnProperty(i.toString())) {
        notVisitedIndexes.push(i);
      }
    }

    isVisited.value = !notVisitedIndexes.includes(props.index);
    isFirstNotVisited.value = notVisitedIndexes[0] === props.index;
  };

  const handleClick = () => {
    markAsVisited();
    checkVisitedStatus();
  };

  onMounted(() => {
    checkVisitedStatus();
  });
</script>

<template>
  <li
    :class="{
      'opacity-50 border-gray-300': isVisited,
      'border-primary hover:shadow-lg hover:-translate-y-1': !isVisited
    }"
    class="relative bg-white rounded-3xl border p-4 transition-all flex flex-col"
  >
    <a
      :href="offer.link"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClick"
      class="flex items-center justify-between border-b border-primary pb-4 mb-4"
    >
      <img
        :src="offer.logo"
        :alt="offer.name"
        class="h-12 w-1/2 object-contain">
      <div
        :class="{ 'animate-pulse-subtle': isFirstNotVisited }"
        class="bg-primary text-white rounded-2xl px-4 py-2 text-center min-w-[90px] shadow-md"
      >
        <div class="text-base font-bold leading-tight">{{ approvalRate }}%</div>
        <div class="text-[10px] leading-tight">одобряемость</div>
      </div>
    </a>

    <div class="flex flex-wrap justify-center items-center gap-x-2 gap-y-2 mb-4 text-gray-600">
      <div class="border border-gray-200 px-1.5 py-0.5 rounded-lg">
        <p class="text-sm font-medium">{{ offer.percentage }}% / день</p>
      </div>
      <div class="border border-gray-200 px-1.5 py-0.5 rounded-lg">
        <p class="text-sm font-medium">от {{ offer.approved_age_min }} лет</p>
      </div>
      <div class="border border-gray-200 px-1.5 py-0.5 rounded-lg">
        <p class="text-sm font-medium">до {{ offer.loan_length_max }} дн</p>
      </div>
    </div>

    <div class="text-center mb-4 text-black">
      <p class="text-sm mb-1">ПРЕДОДОБРЕНО</p>
      <p class="text-2xl font-bold">
        {{ formatNumber(Number(offer.max_loan)) }}
        <span class="text-lg">₽</span>
      </p>
    </div>

    <a
      :href="offer.link"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClick"
      class="mt-auto"
    >
      <button
        :class="{
          'animate-button-pulse': isFirstNotVisited && !isVisited,
          'bg-primary hover:bg-primary/90 hover:shadow-md hover:shadow-primary/50': !isVisited,
          'bg-gray-400 cursor-not-allowed': isVisited
        }"
        :disabled="isVisited"
        class="block w-full bg-primary text-white font-semibold py-3 px-4 rounded-xl
        text-center transition-all active:scale-96 cursor-pointer">
        {{ buttonText }}
      </button>
    </a>
  </li>
</template>

<style scoped>
  @keyframes pulse-subtle {
    0%, 100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(147, 204, 0, 0.7);
    }
    50% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(147, 204, 0, 0);
    }
  }

  @keyframes button-pulse {
    0%, 100% {
      transform: scale(0.98);
    }
    50% {
      transform: scale(1);
    }
  }

  .animate-pulse-subtle {
    animation: pulse-subtle 2s infinite;
  }

  .animate-button-pulse {
    animation: button-pulse 1s infinite;
  }
</style>
