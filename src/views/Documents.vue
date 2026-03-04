<script setup lang="ts">
  import { useAutoDocs } from "@/utils/auto-docs.ts";
  import { Download } from "lucide-vue-next";
  import { useComebacker } from "@/utils/common.ts";
  import CalculatorBottom from "@/components/CalculatorBottom.vue";


  const {
    publicOfertaPdf,
    personalDataPoliticPdf,
    personalDataAgreementPdf,
    paidSubAgreementPdf,
    recurrPaymentsAgreementPdf,
    cardDataAgreementPdf
  } = useAutoDocs();

  useComebacker();
</script>

<template>
  <div class="container py-12 px-4">
    <div class="space-y-4" data-aos="fade-in">
      <h2 class="text-5xl font-bold text-black">
        Документы
      </h2>
      <p class="text-black">
        Заполняя анкету на нашем сервисе Вы соглашаетесь с условиями и соглашениями указанными на сайте.
      </p>
    </div>

    <div class="mt-6" data-aos="fade-in">
      <a
        v-if="publicOfertaPdf"
        :href="publicOfertaPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Соглашение (оферта) об использовании Интернет-сервиса</p>
      </a>

      <a
        v-if="personalDataPoliticPdf"
        :href="personalDataPoliticPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Политика обработки персональных данных</p>
      </a>

      <a
        v-if="personalDataAgreementPdf"
        :href="personalDataAgreementPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Согласие на обработку персональных данных</p>
      </a>

      <a
        v-if="paidSubAgreementPdf"
        :href="paidSubAgreementPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Соглашение на оформление платной подписки</p>
      </a>

      <a
        v-if="recurrPaymentsAgreementPdf"
        :href="recurrPaymentsAgreementPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Соглашение на применение рекуррентных платежей</p>
      </a>

      <a
        v-if="cardDataAgreementPdf"
        :href="cardDataAgreementPdf"
        target="_blank"
        class="w-fit flex items-center gap-2 text-primary hover:text-primary/70 transition py-2">
        <Download class="shrink-0"/>
        <p>Соглашение о хранении учётных данных владельца карты</p>
      </a>
    </div>

    <CalculatorBottom/>
  </div>
</template>
