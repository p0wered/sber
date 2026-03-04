<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { ClockFading } from 'lucide-vue-next';

  const props = defineProps<{
    startVerification: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'verification-complete'): void;
  }>();

  const progressBarValue = ref(0);
  let intervalId: number | null = null;

  const startProgress = () => {
    if (intervalId) return;

    intervalId = setInterval(() => {
      if (progressBarValue.value < 100) {
        progressBarValue.value += 1;
      } else {
        clearInterval(intervalId as number);
        intervalId = null;
        emit('verification-complete');
      }
    }, 35);
  };

  const stopProgress = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  watch(() => props.startVerification, (newValue) => {
    if (newValue) {
      startProgress();
    } else {
      stopProgress();
      progressBarValue.value = 0;
    }
  });

  onMounted(() => {
    if (props.startVerification) {
      startProgress();
    }
  });

  onUnmounted(() => {
    stopProgress();
  });
</script>

<template>
  <div class="space-y-8 mb-4">
    <div>
      <div class="relative w-full h-14 bg-secondary rounded-lg overflow-hidden mb-2">
        <div
          class="progress-inner bg-primary/15 h-full"
          :style="{ width: progressBarValue + '%' }"
        />
        <div
          class="absolute inset-0 flex items-center text-primary
          justify-center gap-2 pointer-events-none font-medium"
        >
          <ClockFading/>
          <p>Проверяем ваши данные</p>
        </div>
      </div>
      <p class="text-base text-center text-primary">Проверяем по базе ФССП...</p>
    </div>
    <div class="space-y-3">
      <p class="text-center">Не закрывайте это окно</p>
      <p class="text-center">Наши алгоритмы обрабатывают введённые вами данные. Это займёт несколько секунд.</p>
    </div>
  </div>
</template>

<style scoped>
  .progress-inner{
    transition: .1s;
  }
</style>
