<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue';
  import { type Offer, useCompanys } from '../companys.ts';
  import { getLoanData } from "@/utils/common.ts";
  import Card from './Card.vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import DropdownPrimary from '@/components/Common/Dropdowns/DropdownPrimary.vue';
  import ErrorBlock from "@/components/Companys/ErrorBlock.vue";

  const loanAmount = ref<string>('');
  const sortType = ref('default');

  const {
    loading,
    error,
    displayItems,
    clickedOffers,
    displayName,
    handleOfferClick
  } = useCompanys();

  const sortOptions = [
    { label: 'По умолчанию', value: 'default' },
    { label: 'По сумме займа', value: 'amount' },
    { label: 'По сроку займа', value: 'term' }
  ];

  onMounted(() => {
    const { amount } = getLoanData();
    loanAmount.value = formatAmount(amount);
  });

  const formatAmount = (amount: string): string => {
    return new Intl.NumberFormat('ru-RU').format(parseInt(amount));
  };

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
  <div
    class="max-w-[500px] sm:max-w-[620px] lg:max-w-[880px] xl:max-w-[1170px]
    w-full mx-auto min-h-screen md:py-16 py-10 flex flex-col items-center"
  >
    <div class="flex flex-col items-center gap-2 my-4 text-center" data-aos="fade-in">
      <div class="flex gap-2 items-center px-4 py-1 bg-primary/10 rounded-full mb-3">
        <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
        <p class="text-primary font-semibold text-lg">
          Мгновенное одобрение
        </p>
      </div>
      <p
        v-if="displayName"
        class="text-2xl font-bold"
      >
        {{ displayName }},
      </p>
      <p class="text-md">
        Вам предодобрено
        <span class="font-bold text-primary">
          {{ loanAmount }} рублей
        </span>
      </p>
      <p class="text-md px-4">
        Для получения денег подайте заявки в следующие компании
      </p>
    </div>

    <div class="w-full p-1 lg:p-4">
      <div v-if="loading" class="h-80 w-full flex items-center justify-center">
        <LoadingSpinner class="text-primary" size="64px"/>
      </div>

      <ErrorBlock
        v-else-if="error"
        :error="error"
      />

      <div v-else>
        <div class="flex justify-between items-end sm:px-3 px-0 pb-2 sm:pb-4">
          <p class="text-black/70 text-sm md:block hidden">
            Найдено {{ displayItems.length }} предложений
          </p>
          <DropdownPrimary
            v-model="sortType"
            :options="sortOptions"
          />
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-3">
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
