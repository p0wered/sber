<script setup lang="ts">
  import { LogIn } from "lucide-vue-next";
  import LoanCalculator from '@/components/Home/LoanCalculator.vue';
  import Logo from '@/assets/images/logo-black.svg';
</script>

<template>
  <div class="hero-section relative overflow-hidden">
    <div class="hero-dots absolute inset-0 pointer-events-none" />

    <div class="absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[100px] animate-blob-1" />
    <div class="absolute top-1/4 -right-24 w-[22rem] h-[22rem] rounded-full bg-primary/8 blur-[90px] animate-blob-2" />
    <div class="absolute -bottom-24 left-1/3 w-[20rem] h-[20rem] rounded-full bg-primary/5 blur-[80px] animate-blob-3" />
    <div class="absolute top-1/2 left-1/4 w-[14rem] h-[14rem] rounded-full bg-primary-light/6 blur-[70px] animate-blob-2" />

    <div class="relative w-full max-w-148 lg:max-w-6xl mx-auto md:px-8 pb-12 md:pb-36">
      <div class="flex flex-col items-center justify-between gap-3">
        <div
          data-aos="fade-up"
          class="w-full text-center px-5"
        >
          <div class="flex items-center justify-between">
            <img
              class="w-40 md:w-42 select-none"
              :src="Logo"
              alt="Logo"
            >

            <div class="flex items-center gap-2">
              <p class="hidden md:block text-sm font-medium">
                Личный кабинет
              </p>
              <LogIn class="text-black md:text-primary w-6 h-6"/>
            </div>
          </div>

          <div class="max-w-3xl mx-auto pt-4 md:pt-24">
            <h1 class="text-black text-4xl md:text-7xl font-black mb-2 md:mb-4 tracking-tight">
              Быстрые <span class="text-primary">займы</span>
            </h1>

            <p class="text-sm md:text-lg text-black/70 mb-4 md:mb-10 lg:mx-0">
              Способ, позволяющий оплачивать покупки за счет заемных средств. Расплачивайтесь и
              получайте, не думая о мелочах. Тем более со ставкой 0% в день.
            </p>
          </div>
        </div>

        <div class="w-full px-2">
          <LoanCalculator/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-section {
  background: linear-gradient(175deg, #ffffff 0%, #f0faf2 35%, var(--color-secondary) 100%);
}

.hero-dots {
  background-image: radial-gradient(circle, var(--color-primary) 0.6px, transparent 0.6px);
  background-size: 28px 28px;
  opacity: 0.04;
}

@keyframes blob-float-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.97); }
}

@keyframes blob-float-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25px, 20px) scale(0.95); }
  66% { transform: translate(20px, -10px) scale(1.04); }
}

@keyframes blob-float-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(15px, 25px) scale(1.03); }
  66% { transform: translate(-20px, -15px) scale(0.96); }
}

.animate-blob-1 { animation: blob-float-1 16s ease-in-out infinite; }
.animate-blob-2 { animation: blob-float-2 20s ease-in-out infinite; }
.animate-blob-3 { animation: blob-float-3 18s ease-in-out infinite; }
</style>
