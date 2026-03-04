<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { formatPlaceId, injectAdsfinScript } from "@/utils/adsfin";
  import { useCompanys } from "@/components/Companys/companys.ts";
  import OfferCard from '@/components/OfferCard.vue';
  import ErrorBlock from '@/components/Companys/ErrorBlock.vue';

  const { loading, error, displayItems } = useCompanys({ vid: 16 });

  const places = {
    center: "144422628920269113"
  } as const;

  const offers = computed(() => displayItems.value);

  onMounted(() => {
    window.scrollTo(0, 0);

    for (const placeId of Object.values(places)) {
      injectAdsfinScript(placeId);
    }
  });
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <div class="flex-1">
      <section class="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            <span class="text-primary">Поздравляем!</span> Мы подобрали займ для Вас!
          </h1>
          <p class="text-lg md:text-xl mb-2">
            Быстро оформить заявку даже с плохой кредитной историей.
          </p>
          <p class="text-base md:text-lg opacity-90">
            Одновременно подайте не менее 5 заявок в указанные ниже организации.
          </p>
        </div>
      </section>

      <section class="container mx-auto px-4 py-8">
        <div
          v-if="loading"
          class="flex justify-center items-center py-20"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>

        <ErrorBlock
          v-else-if="error"
          :error="error"
        />

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <OfferCard
            v-for="(offer, index) in offers"
            :key="index"
            :offer="offer"
            :index="index"
            :total-offers="offers.length"
          />
        </div>
      </section>

      <div class="container">
        <ins :id="formatPlaceId(places.center)"/>
      </div>

      <section class="bg-gray-900 text-white py-12 px-4 text-center mt-12">
        <div class="container mx-auto">
          <p class="text-sm md:text-base opacity-90 max-w-4xl mx-auto">
            Сайт НЕ является представительством МФО или банком, не выдает займов и кредитов. 
            Условия неуплаты можно уточнить на сайте МФО.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>