<script setup lang="ts">
  import { Check, FileText, Lock } from "lucide-vue-next";
  import { useAutoDocs } from "@/utils/auto-docs.ts";

  const {
    personalDataAgreementPdf,
    paidSubAgreementPdf,
    recurrPaymentsAgreementPdf
  } = useAutoDocs();
</script>

<template>
  <div class="grid gap-1.5 sm:gap-2">
    <a
      v-if="paidSubAgreementPdf"
      :href="paidSubAgreementPdf"
      target="_blank"
      class="
      group flex items-center gap-2 sm:gap-3
      p-2 sm:p-2.5
      bg-blue-50 border border-blue-200/30
      rounded-lg
      hover:from-blue-100 hover:to-indigo-100
      hover:border-blue-300/50 hover:shadow-md
      hover:border-opacity-70
      transition-all duration-200"
    >
      <div
        class="
        p-1.5 bg-white/60 rounded-md
        shadow-sm group-hover:shadow-md
        transition-shadow flex-shrink-0"
      >
        <FileText class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
      </div>
      <div class="flex-1 min-w-0">
        <p
          class="
          text-sm sm:text-base text-stone-700
          group-hover:text-blue-800 font-medium"
        >
          Условия и согласие на оформление платной подписки
        </p>
      </div>
      <Check class="w-5 h-5 text-green-600 flex-shrink-0" />
    </a>

    <a
      v-if="personalDataAgreementPdf"
      :href="personalDataAgreementPdf"
      target="_blank"
      class="
      group flex items-center gap-2 sm:gap-3
      p-2 sm:p-2.5
      border bg-green-50 border-green-200/30
      rounded-lg
      hover:border-green-300/50 hover:shadow-md
      hover:border-opacity-70
      transition-all duration-200"
    >
      <div
        class="
        p-1.5 bg-white/60 rounded-md
        shadow-sm group-hover:shadow-md
        transition-shadow flex-shrink-0"
      >
        <FileText class="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
      </div>
      <div class="flex-1 min-w-0">
        <p
          class="
          text-sm sm:text-base text-stone-700
          group-hover:text-green-800 font-medium"
        >
          Согласие на регулярные (реккурентные) платежи
        </p>
      </div>
      <Check class="w-5 h-5 text-green-600 flex-shrink-0" />
    </a>

    <a
      v-if="recurrPaymentsAgreementPdf"
      :href="recurrPaymentsAgreementPdf"
      target="_blank"
      class="
      group flex items-center gap-2 sm:gap-3
      p-2 sm:p-2.5
      bg-amber-50 border border-amber-200/30
      rounded-lg
      hover:border-amber-300/50 hover:shadow-md
      hover:border-opacity-70
      transition-all duration-200"
    >
      <div
        class="
        p-1.5 bg-white/60 rounded-md
        shadow-sm group-hover:shadow-md
        transition-shadow flex-shrink-0"
      >
        <FileText class="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
      </div>
      <div class="flex-1 min-w-0">
        <p
          class="
          text-sm sm:text-base text-stone-700
          group-hover:text-amber-800 font-medium"
        >
          Согласие на регулярные платежи
        </p>
      </div>
      <Check class="w-5 h-5 text-green-600 flex-shrink-0" />
    </a>
  </div>
  <div class="mt-2 p-2 bg-stone-50 rounded-lg border border-stone-200/70">
    <p class="text-xs text-stone-500 text-center">
      <Lock class="w-3 h-3 inline mr-1 text-stone-400" />
      Все документы заверены подписью и печатью исполнителя и имеют юридическую силу
    </p>
  </div>
</template>
