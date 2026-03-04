<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { type Offer, useCompanys } from '../companys.ts';
  import { CircleQuestionMark } from "lucide-vue-next";
  import { getLoanData } from "@/utils/common.ts";
  import Card from './Card.vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";
  import DropdownPrimary from "@/components/Common/Dropdowns/DropdownPrimary.vue";
  import ErrorBlock from "@/components/Companys/ErrorBlock.vue";

  const loanAmount = ref<string>('');
  const sortType = ref('default');

  const sortOptions = [
    { label: 'По умолчанию', value: 'default' },
    { label: 'По сумме займа', value: 'amount' },
    { label: 'По сроку займа', value: 'term' }
  ];

  const formatAmount = (amount: string): string => {
    return new Intl.NumberFormat('ru-RU').format(parseInt(amount));
  };

  onMounted(() => {
    const { amount } = getLoanData();
    loanAmount.value = formatAmount(amount);
  });

  const {
    loading,
    error,
    displayItems,
    clickedOffers,
    displayName,
    handleOfferClick
  } = useCompanys();

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
  <div class="min-h-screen flex flex-col items-center">
    <div class="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-7xl mt-4 p-4 rounded-3xl">
      <div class="flex flex-col items-center gap-2 my-8 text-center" data-aos="fade-in">
        <div class="flex gap-2 items-center px-4 py-1 bg-primary/20 rounded-full mb-3">
          <div class="w-2 h-2 bg-primary rounded-full animate-pulse"/>
          <p class="text-primary font-semibold text-sm">
            Мгновенное одобрение
          </p>
        </div>
        <p
          v-if="displayName"
          class="text-2xl font-bold"
        >
          {{ displayName }},
        </p>
        <p>
          Вам предодобрено
          <span class="font-bold text-primary">
            {{ loanAmount }} рублей
          </span>
        </p>
        <p>
          Для получения денег подайте заявки в следующие компании
        </p>
      </div>

      <div v-if="loading" class="h-[50vh] w-full flex items-center justify-center">
        <LoadingSpinner class="text-primary" size="64px"/>
      </div>

      <ErrorBlock
        v-else-if="error"
        :error="error"
      />

      <div data-aos="fade-up" v-else>
        <div class="flex flex-row-reverse md:flex-row justify-between items-end md:px-4 px-2 pb-3">
          <p class="text-md text-black/75 hidden md:block">
            Найдено {{ displayItems.length }} предложений
          </p>
          <DropdownPrimary
            v-model="sortType"
            :options="sortOptions"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <template v-for="item in sortedDisplayItems" :key="item.id">
            <Card
              :offer="item"
              :is-clicked="clickedOffers.has(item.id)"
              @offer-clicked="handleOfferClick"
            />
          </template>
          <div
            class="bg-white rounded-3xl flex gap-4 flex-col justify-between min-h-[300px]
            transition p-4 border border-gray-200 hover:border-primary/50 hover:shadow-xl
            hover:-translate-y-1"
          >
            <div class="flex flex-col items-center h-full justify-center">
              <CircleQuestionMark class="w-12 h-12 text-primary"/>
              <p class="text-center font-semibold text-black translate-y-2">
                Не нашли подходящего предложения?
              </p>
            </div>

            <router-link
              to="/offers"
              class="block w-full bg-primary/10 hover:bg-primary text-primary
              hover:text-white font-semibold hover:shadow-md hover:shadow-primary/50
              px-4 py-3 rounded-xl text-center transition-all cursor-pointer">
              Посмотреть другие
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
