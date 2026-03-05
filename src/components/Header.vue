<script setup lang="ts">
  import { LogIn } from 'lucide-vue-next';
  import { onBeforeUnmount, ref, watch } from 'vue';
  import router from "@/router";
  import LogoBlack from '@/assets/images/logo-black.svg';

  interface Props {
    onHomePage: boolean;
  }

  const { onHomePage = false } = defineProps<Props>();

  const showHeader = ref(false);

  const handleScroll = () => {
    showHeader.value = window.scrollY > 128;
  };

  watch(() => onHomePage, (isHome) => {
    if (isHome) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    } else {
      window.removeEventListener('scroll', handleScroll);
      showHeader.value = false;
    }
  }, { immediate: true });

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
</script>

<template>
  <header
    class="w-full z-50"
    :class="[
      onHomePage
        ? 'fixed mt-2 px-2'
        : 'relative bg-white border-b border-b-gray-200',
      onHomePage ? (showHeader ? 'translate-y-0' : '-translate-y-24') : '',
      onHomePage ? 'transition-transform duration-300' : ''
    ]"
  >
    <div
      class="max-w-6xl mx-auto flex justify-between items-center gap-3 relative"
      :class="
        onHomePage
          ? 'bg-white/70 backdrop-blur-lg rounded-3xl shadow-md border border-gray-200 h-auto p-3 md:p-4'
          : 'md:h-auto h-[64px] p-4'"
    >
      <router-link
        class="hover:opacity-70 transition"
        to="/"
        @click="router.push('/')"
        @keydown.enter="router.push('/')"
        @keydown.space.prevent="router.push('/')"
      >
        <img
          class="w-32 md:w-36 h-8 md:h-8"
          :src="LogoBlack"
          alt="С-Деньги"
        >
      </router-link>

      <a href="/login" class="flex gap-2 items-center hover:opacity-70 transition">
        <p class="hidden md:block text-sm md:text-base font-medium">
          Личный кабинет
        </p>
        <div
          class="w-11 md:w-auto h-11 md:h-auto flex items-center justify-center
          bg-primary/15 md:bg-transparent rounded-xl"
        >
          <LogIn class="text-primary w-6 h-6 md:w-6 md:h-6"/>
        </div>
      </a>
    </div>
  </header>
</template>
