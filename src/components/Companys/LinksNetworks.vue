<script setup lang="ts">
  import TgBotImage from '@/assets/images/companys/tg-bot.svg';
  import VkBotImage from '@/assets/images/companys/vk-bot.svg';
</script>

<template>
  <div class="container flex flex-col justify-center items-center py-12">
    <p class="text-black/60 mb-6">
      Не подошли условия?
    </p>
    <div class="flex md:flex-row flex-col gap-3">
      <a
        class="bg-white p-3 border border-[#1d94d3] rounded-3xl hover:opacity-75 transition"
        :href="$config.bots.bot_link || 'https://t.me/zaym_help_bot'"
        target="_blank">
        <img
          class="w-56 h-16"
          :src="TgBotImage"
          alt="Telegram">
      </a>
      <a
        class="bg-white p-3 border border-[#0077ff] rounded-3xl hover:opacity-75 transition"
        :href="$config.bots.vk_link || 'https://vk.me/finsos'"
        target="_blank">
        <img
          class="w-56 h-16"
          :src="VkBotImage"
          alt="Telegram">
      </a>
    </div>
  </div>
</template>
