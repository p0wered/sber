<script setup lang="ts">
  interface Offer {
    id: string;
    logo: string;
    name: string;
    max_loan: string;
    offer_type: string;
    partner_id: string;
    percentage: string;
    variant_id: string;
    loan_length_max: string;
    loan_length_min: string;
    approved_age_max: string;
    approved_age_min: string;
    link: string;
  }

  interface Props {
    offer: Offer;
    isClicked: boolean;
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
  };
</script>

<template>
  <div
    class="bg-white rounded-3xl flex flex-col justify-between
    transition-all p-4 border border-gray-200 group"
    :class="
      isClicked
        ? 'opacity-85 border border-gray-200'
        : 'hover:border-primary/70 hover:shadow-xl hover:-translate-y-1'
    "
  >
    <div class="flex items-center mb-2">
      <a
        :href="offer.link"
        class="w-full h-24 px-6 py-2 rounded-xl flex items-center transition
        justify-center border border-gray-200"
        :class="{'group-hover:shadow-md': !isClicked}"
      >
        <img
          :src="offer.logo"
          :alt="offer.name"
          class="w-full h-[100%] object-contain"
        >
      </a>
    </div>

    <div class="space-y-4 mb-3 mt-2 flex flex-col items-center">
      <div
        class="flex gap-1 bg-gradient-to-r from-primary/10 to-primary/20 border
        border-primary/30 rounded-full px-3 p-0.5"
      >
        <p class="text-center text-[16px]">
          Процентная ставка
          <span class="font-bold">
            {{ offer.percentage }}%
          </span>
        </p>
      </div>

      <div>
        <p class="text-center text-black/70">
          Сумма до
          <span class="font-bold text-black">
            {{ formatAmount(offer.max_loan) }} RUB
          </span>
        </p>
      </div>

      <div>
        <p class="text-center text-black/70">
          Возраст
          <span class="font-semibold text-black -tracking-wide">
            от {{ offer.approved_age_min }} до {{ offer.approved_age_max }} лет
          </span>
        </p>
      </div>
    </div>

    <div class="space-y-3">
      <a
        v-if="!isClicked"
        :href="offer.link"
        target="_blank"
        class="block w-full bg-primary/10 hover:bg-primary text-primary
        hover:text-white font-semibold hover:shadow-md hover:shadow-primary/50
        p-4 rounded-xl text-center transition-all active:scale-96"
        @click="handleClick">
        Получить деньги
      </a>

      <button
        v-else
        disabled
        class="block w-full bg-gray-400 text-white
        font-semibold p-4 rounded-xl text-center
        cursor-not-allowed">
        Просмотрено
      </button>
    </div>
  </div>
</template>
