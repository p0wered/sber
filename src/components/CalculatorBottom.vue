<script setup lang="ts">
  import { CheckCircle } from 'lucide-vue-next';
  import { useUtmSource } from "@/utils/common.ts";
  import LoanCalculator from '@/components/Home/LoanCalculator.vue';

  const { hasUtmSource } = useUtmSource();
</script>

<template>
  <div class="flex xl:flex-row flex-col-reverse xl:items-center xl:gap-12 gap-6 mt-12 mb-6" data-aos="fade-in">
    <LoanCalculator
      :small="true"
      class="border border-gray-200 hover:shadow-lg transition-all"
    />

    <div class="space-y-6">
      <h2 class="text-2xl md:text-3xl font-bold text-black">
        Поможем с самыми выгодными условиями займа
      </h2>

      <div class="flex xl:flex-col flex-wrap gap-6">
        <div class="flex gap-2 items-center text-primary">
          <CheckCircle/>
          <p>Любая кредитная карта</p>
        </div>
        <div class="flex gap-2 items-center text-primary">
          <CheckCircle/>
          <p>Получение услуги за 5 минут</p>
        </div>
        <div class="flex gap-2 items-center text-primary">
          <CheckCircle/>
          <p>
            Нужен только телефон
            <span v-if="!hasUtmSource"> и паспорт</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>