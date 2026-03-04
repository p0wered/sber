<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { type Offer, useCompanys } from '../companys.ts';
  import Card from './Card.vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import DropdownPrimary from '@/components/Common/Dropdowns/DropdownPrimary.vue';
  import ErrorBlock from "@/components/Companys/ErrorBlock.vue";

  const {
    loading,
    error,
    displayItems,
    clickedOffers,
    handleOfferClick
  } = useCompanys();

  const sortOptions = [
    { label: 'По умолчанию', value: 'default' },
    { label: 'По сумме займа', value: 'amount' },
    { label: 'По сроку займа', value: 'term' }
  ];

  const sortType = ref('default');

  const sortItems = (items: (Offer & { type: string })[]) => {
    let sorted = [...items];
    if (sortType.value === 'amount') {
      sorted.sort((a, b) => parseInt(b.max_loan) - parseInt(a.max_loan));
    } else if (sortType.value === 'term') {
      sorted.sort((a, b) => parseInt(b.loan_length_max) - parseInt(a.loan_length_max));
    }
    return sorted;
  };

  const sortedDisplayItems = computed(() => {
    const notClicked = displayItems.value.filter(item => !clickedOffers.value.has(item.id));
    const clicked = displayItems.value.filter(item => clickedOffers.value.has(item.id));
    return [...sortItems(notClicked), ...sortItems(clicked)];
  });
</script>

<template>
  <div class="min-h-screen md:py-16 py-10 flex flex-col items-center">
    <div class="text-center mb-8">
      <div class="text-center mb-8 px-2">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-primary/15
          text-primary rounded-full text-sm font-semibold mb-4"
        >
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
          Мгновенное одобрение
        </div>
        <h2 class="text-xl md:text-2xl font-black text-black mb-3 tracking-tight">
          Получите займ за 5 минут
        </h2>
        <p class="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
          Выберите лучший займ из проверенных партнеров. Без справок, без поручителей, онлайн заявка.
        </p>
      </div>
    </div>

    <div class="max-w-[400px] sm:max-w-[720px] lg:max-w-[1000px] xl:max-w-[1300px] w-full p-4">
      <div v-if="loading" class="h-80 w-full flex items-center justify-center">
        <LoadingSpinner class="text-primary" size="64px"/>
      </div>

      <ErrorBlock
        v-else-if="error"
        :error="error"
      />

      <div v-else>
        <div class="flex justify-between items-end sm:px-3 px-0 pb-4">
          <p class="text-black/70 text-sm md:block hidden">
            Найдено {{ displayItems.length }} предложений
          </p>
          <DropdownPrimary
            v-model="sortType"
            :options="sortOptions"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <template v-for="item in sortedDisplayItems" :key="item.id">
            <Card
              :offer="item"
              :is-clicked="clickedOffers.has(item.id)"
              @offer-clicked="handleOfferClick"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
