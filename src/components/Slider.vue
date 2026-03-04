<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { formatCurrency } from '@/utils/format.ts';

  interface Props {
    modelValue: number;
    label?: string;
    min?: number;
    max?: number;
    step?: number;
    type?: 'amount' | 'period';
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    min: 0,
    max: 100,
    step: 1,
    type: 'period'
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  const sliderRef = ref<HTMLElement | null>(null);
  const isDragging = ref(false);

  const infoLabel = computed(() => {
    return props.type === 'amount' ? 'Сумма возврата' : 'Дата возврата';
  });

  const infoValue = computed(() => {
    if (props.type === 'amount') {
      return formatCurrency(props.modelValue);
    }
    const date = new Date();
    date.setDate(date.getDate() + props.modelValue);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  });

  const percentage = computed(() => {
    const range = props.max - props.min;
    if (range === 0) return 0;
    return ((props.modelValue - props.min) / range) * 100;
  });

  const snapToStep = (value: number): number => {
    const steps = Math.round((value - props.min) / props.step);
    const snappedValue = props.min + steps * props.step;
    return Math.max(props.min, Math.min(props.max, snappedValue));
  };

  const updateValue = (clientX: number, shouldEmitChange = false) => {
    if (!sliderRef.value) return;

    const rect = sliderRef.value.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    const range = props.max - props.min;
    const rawValue = props.min + percentage * range;
    const newValue = snapToStep(rawValue);

    if (newValue !== props.modelValue) {
      emit('update:modelValue', newValue);
      if (shouldEmitChange) {
        emit('change', newValue);
      }
    }
  };

  const handleMouseDown = (event: MouseEvent) => {
    isDragging.value = true;
    updateValue(event.clientX);

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.value) {
        updateValue(e.clientX);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging.value) {
        updateValue(e.clientX, true);
        isDragging.value = false;
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (event: TouchEvent) => {
    isDragging.value = true;
    event.preventDefault();
    const touch = event.touches[0];
    updateValue(touch.clientX);

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.value && e.touches.length > 0) {
        e.preventDefault();
        updateValue(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDragging.value) {
        const touch = e.changedTouches[0];
        updateValue(touch.clientX, true);
        isDragging.value = false;
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleSliderClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains('slider-handle')) {
      return;
    }
    updateValue(event.clientX, true);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    let newValue = props.modelValue;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(props.max, props.modelValue + props.step);
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(props.min, props.modelValue - props.step);
        event.preventDefault();
        break;
      case 'Home':
        newValue = props.min;
        event.preventDefault();
        break;
      case 'End':
        newValue = props.max;
        event.preventDefault();
        break;
      default:
        return;
    }

    if (newValue !== props.modelValue) {
      emit('update:modelValue', newValue);
      emit('change', newValue);
    }
  };
</script>

<template>
  <div class="calc-slider">
    <div class="calc-slider__label flex flex-row justify-between items-end gap-4 text-md">
      <div class="text-md md:text-lg text-black/90">
        {{ label }}
      </div>
      <div class="text-primary text-xl md:text-xl font-bold">
        <slot>{{ modelValue }}</slot>
      </div>
    </div>

    <div
      ref="sliderRef"
      tabindex="0"
      role="slider"
      :aria-label="label || 'Слайдер'"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      :aria-valuetext="type === 'amount' ? formatCurrency(modelValue) : modelValue + ' дн.'"
      class="relative w-full h-[22px] cursor-pointer select-none flex items-center"
      @click="handleSliderClick"
      @keydown="handleKeyDown"
    >
      <div class="relative w-full h-[8px] bg-[#eaeaea] rounded-full">
        <div
          class="slider-progress absolute top-0 left-0 h-full bg-primary
          rounded-full pointer-events-none"
          :style="{ width: percentage + '%' }"
        />
        <div
          class="slider-handle absolute w-[24px] h-[16px] bg-primary-light rounded-full z-[2]
          touch-none top-1/2 shadow-md transition-transform"
          :class="{
            'dragging': isDragging,
          }"
          :style="{ left: percentage + '%' }"
          @mousedown="handleMouseDown"
          @touchstart.prevent="handleTouchStart"
        />
      </div>
    </div>

    <div class="calc-slider__info flex justify-between items-center text-sm text-black/70">
      <span>
        {{ infoLabel }}
      </span>

      <span class="font-medium">
        {{ infoValue }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  .slider-handle {
    transform: translateX(-50%) translateY(-50%);
  }

  .calc-slider [role="slider"] {
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
  }
</style>