<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value?: string;
  modelValue: boolean | string[];
  disabled?: boolean;
  name?: string;
  isError?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean | string[]): void;
}>();

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue) && props.value !== undefined) {
    return props.modelValue.includes(props.value);
  }
  return Boolean(props.modelValue);
});

function updateInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const checked = target.checked;
  if (Array.isArray(props.modelValue) && props.value !== undefined) {
    const arr = [...props.modelValue];
    if (checked) arr.push(props.value);
    else {
      const idx = arr.indexOf(props.value);
      if (idx !== -1) arr.splice(idx, 1);
    }
    emit('update:modelValue', arr);
  } else {
    emit('update:modelValue', checked);
  }
}

</script>

<template>
  <label
    class="relative pl-8 mb-3 cursor-pointer select-none
    text-[11px] md:text-[13px] text-black/50 inline-block w-full"
  >
    <span class="inline-block align-middle">
      <slot />
    </span>
    <input
      type="checkbox"
      :name="name"
      class="peer absolute opacity-0 h-0 w-0"
      :checked="isChecked"
      @change="updateInput"
      :disabled="disabled"
    >
    <span
      :class="[
        'checkbox absolute left-0 top-[2px] h-5 w-5 rounded-md transition-colors',
        isError
          ? 'checkbox-error'
          : 'checkbox'
      ]"
    />
    <span
      class="absolute left-[7px] top-[5px] w-1.5 h-3
      border-white border-r-2 border-b-2 rotate-45
      hidden peer-checked:block"
    />
  </label>
</template>

<style scoped>
  .checkbox {
    border: 1px solid rgb(207, 211, 218);
  }

  .checkbox-error {
    border: 1px solid red;
  }

  input:checked + .checkbox {
    background-color: var(--color-primary);
    border: 0 solid rgb(207, 211, 218);
  }
</style>