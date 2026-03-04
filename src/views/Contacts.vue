<script setup lang="ts">
  import { useComebacker } from "@/utils/common.ts";
  import CalculatorBottom from "@/components/CalculatorBottom.vue";

  useComebacker();
</script>

<template>
  <div class="container py-6 md:py-12 px-4">
    <div class="space-y-5 md:space-y-8" data-aos="fade-in">
      <div class="space-y-3">
        <h2 class="text-2xl md:text-4xl font-bold text-black">
          Обратная связь
        </h2>
        <p class="text-black">
          Если у вас процессе пользования нашим сервисом возникли вопросы, наши специалисты готовы вам помочь.
        </p>
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl md:text-3xl font-bold text-black">
          Телефон горячей линии:
        </h2>
        <a
          :href="'tel:' + $config.phoneNumber"
          class="text-primary hover:text-primary/70 text-lg md:text-2xl">
          {{ $config.phoneNumber }}
        </a>
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl md:text-3xl font-bold text-black">
          Email:
        </h2>
        <a
          :href="'mailto:' + $config.email"
          class="text-primary hover:text-primary/70 text-lg md:text-2xl">
          {{ $config.email }}
        </a>
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl md:text-3xl font-bold text-black">
          Оперативная помощь в Telegram
        </h2>
        <a
          :href="$config.bots.bot_support_link || 'https://t.me/live_tehpodderzhka_bot'"
          target="_blank"
          class="text-primary hover:text-primary/70 text-lg md:text-2xl">
          Написать в Telegram
        </a>
      </div>
    </div>
    <CalculatorBottom/>
  </div>
</template>
