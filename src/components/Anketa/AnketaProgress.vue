<script setup lang="ts">
  import { computed } from 'vue';
  import { useUtmSource } from '@/utils/common.ts';

  interface ApplyProgressProps {
    step: number;
    shortAnketa?: boolean;
  }

  const props = defineProps<ApplyProgressProps>();
  const { hasUtmSource } = useUtmSource();

  const steps = computed(() => {
    if (props.shortAnketa) {
      return ['Контактная информация'];
    }
    if (hasUtmSource.value) {
      return ['Контактная информация', 'Личные данные'];
    }
    return ['Контактная информация', 'Личные данные', 'Паспортные данные'];
  });

  const activeIndex = computed(() => {
    const idx = (props.step ?? 1) - 1;
    const maxIdx = steps.value.length - 1;
    return Math.max(0, Math.min(idx, maxIdx));
  });

  const dotDiameter = 16;
  const segmentGap = 36;

  const trackHeightPx = computed(() => {
    const count = steps.value.length;
    return count > 1 ? dotDiameter + segmentGap * (count - 1) : dotDiameter;
  });

  const dotTopPx = computed(() => {
    const count = steps.value.length;
    if (count <= 1) return 0;
    const usableHeight = trackHeightPx.value - dotDiameter;
    const stepGap = usableHeight / (count - 1);
    return activeIndex.value * stepGap;
  });
</script>

<template>
  <div class="flex gap-4 mb-6">
    <div
      class="bg-secondary w-4 rounded-full mt-1 relative"
      :style="{ height: trackHeightPx + 'px' }"
    >
      <div
        class="bg-primary w-4 h-4 rounded-full absolute left-0 transition-all"
        :style="{ top: dotTopPx + 'px' }"
      />
    </div>

    <div class="space-y-2">
      <p
        v-for="(label, idx) in steps"
        :key="idx"
        class="transition-all font-medium text-black"
        :class="{
          'text-gray-400': idx !== activeIndex
        }"
      >
        {{ label }}
      </p>
    </div>
  </div>
</template>