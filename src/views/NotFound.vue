<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import ButtonPrimary from '@/components/Common/Buttons/ButtonPrimary.vue';

  const router = useRouter();

  function goHome() {
    router.push('/');
  }
</script>

<template>
  <div class="container min-h-[calc(100vh-65px)] flex flex-col items-center justify-center md:px-8 px-4 md:py-16 py-10">
    <div class="text-center space-y-8 max-w-md">
      <div class="relative">
        <span class="text-[146px] md:text-[196px] font-black text-primary leading-none select-none">
          404
        </span>
      </div>

      <div class="space-y-2">
        <h1 class="text-2xl md:text-4xl font-bold text-black">
          Страница не найдена
        </h1>

        <p class="text-gray-500 text-base md:text-lg">
          К сожалению, запрашиваемая вами страница не существует или была удалена.
        </p>
      </div>

      <div class="pt-4 max-w-xs mx-auto">
        <ButtonPrimary 
          label="Вернуться на главную"
          @click="goHome"
        />
      </div>
    </div>
  </div>
</template>
