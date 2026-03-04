<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { ChevronDown } from "lucide-vue-next";

  interface DropdownOption {
    label: string;
    value: string | number;
  }

  const props = defineProps<{
    options: DropdownOption[];
    modelValue?: string | number;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
  }>();

  const isOpen = ref(false);
  const selected = ref(props.modelValue);

  const selectedLabel = computed(() => {
    const selectedOption = props.options.find(opt => opt.value === selected.value);
    return selectedOption ? selectedOption.label : '';
  });

  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };

  const selectOption = (option: DropdownOption) => {
    selected.value = option.value;
    emit('update:modelValue', option.value);
    isOpen.value = false;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!event.target) return;
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<template>
  <div class="relative inline-block">
    <button
      @click="toggleMenu"
      class="flex justify-between items-center bg-white text-black
      pl-4 pr-2 py-2 rounded-xl text-sm cursor-pointer border border-gray-200
      hover:border-primary transition-all w-full min-w-40 hover:shadow-sm">
      {{ selectedLabel || 'Выберите опцию' }}
      <ChevronDown class="ml-2 w-5 h-5"/>
    </button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <ul
        v-if="isOpen"
        class="absolute left-0 mt-2 w-full bg-white border border-gray-200
        rounded-xl overflow-hidden shadow-lg z-10 p-2"
      >
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm transition cursor-pointer"
          :class="{'text-primary': option.value === selected}">
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>
