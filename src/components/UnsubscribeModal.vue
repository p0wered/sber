<script setup lang="ts">
  const { show } = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['close', 'changeTariff', 'unsubscribe']);

  const closeModal = () => {
    emit('close');
  };

  const handleChangeTariff = () => {
    emit('changeTariff');
  };

  const handleUnsubscribe = () => {
    emit('unsubscribe');
  };
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-[1000] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"/>
    <div class="relative w-full max-w-[530px] mx-5">
      <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] overflow-hidden relative">
        <button 
          class="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center
          bg-transparent border-none cursor-pointer p-0 z-10"
          @click="closeModal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13M1 1L13 13"
              stroke="#A6A6A6"
              stroke-width="2"
              stroke-linecap="round">
            </path>
          </svg>
        </button>
        <div class="p-6">
          <p class="font-semibold text-lg leading-6 text-black mb-3.5">
            Вы уверены, что хотите отписаться? Вы можете заново активировать подписку за 299 руб.
            с базовым функционалом сервиса и получить:
          </p>
          <div class="flex flex-col gap-2 mb-5">
            <p class="text-black text-lg">Витрину с 5 займами с вероятностью одобрения 99%</p>
            <p class="text-black text-lg">Витрину с двумя новыми займами</p>
            <p class="text-black text-lg">СМС-информирование о новых предложениях</p>
          </div>
          <div class="flex gap-3 max-md:flex-col">
            <button 
              class="flex-1 px-3 py-4 rounded-lg font-semibold text-base leading-5
              cursor-pointer border-none transition-all duration-200 bg-[var(--color-primary)]
              text-white hover:opacity-80"
              @click="handleChangeTariff"
            >
              Сменить тариф
            </button>
            <button 
              class="flex-1 px-3 py-4 rounded-lg font-semibold text-base leading-5
              cursor-pointer border-none transition-all duration-200 bg-gray-100
            text-black hover:bg-gray-200"
              @click="handleUnsubscribe"
            >
              Да, отписаться
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
