<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useRouter } from "vue-router";
  import { navigateToApply } from "@/utils/common.ts";
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";

  const router = useRouter();

  const steps = ([
    {
      title: "Заполните анкету",
      desc: "Заполните онлайн-заявку — не нужно посещать офис"
    },
    {
      title: "Дождитесь предложений",
      desc: "Подберём займ с быстрым оформлением"
    },
    {
      title: "Завершите оформление",
      desc: "Заполните онлайн-заявку на займ с беспроцентным периодом"
    }
  ]);

  const scrollContainer = ref<HTMLElement | null>(null);
  const activeIndex = ref(0);

  const onScroll = () => {
    if (!scrollContainer.value) return;
    const el = scrollContainer.value;
    const children = el.children;
    if (!children.length) return;

    const containerLeft = el.scrollLeft + el.offsetWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(containerLeft - childCenter);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }

    activeIndex.value = closest;
  };

  const isMobile = ref(false);
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768;
  };

  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile);
  });
</script>

<template>
  <div class="how-to-section relative z-1">
    <div class="w-full max-w-6xl mx-auto px-0 md:px-8 py-12">
      <div
        data-aos="fade-up"
        class="text-left md:text-center mb-3 md:mb-14 px-4"
      >
        <h2 class="font-bold md:font-black text-3xl md:text-5xl">
          Получите займ за 5 минут
        </h2>

        <p class="text-md md:text-lg mt-2 text-black/60">
          Всего 3 шага до выгодных условий
        </p>
      </div>

      <div
        ref="scrollContainer"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-pl-3 pt-3 pb-3
        md:grid md:grid-cols-3 md:overflow-visible md:snap-none md:pb-0 md:pt-0
        md:gap-4 md:mb-5 scrollbar-hide"
        @scroll="onScroll"
      >
        <div
          v-for="(step, index) in steps"
          :key="index"
          data-aos="fade-up"
          :data-aos-delay="index * 50"
          class="ml-3 md:ml-0 max-w-[75vw] sm:max-w-[45vw] snap-start
          shrink-0 md:min-w-0 md:max-w-none md:shrink"
        >
          <div
            class="w-full h-full p-5 md:p-6 bg-white rounded-3xl flex flex-col justify-center
            md:items-center gap-1 md:gap-3 relative border border-gray-200 transition group
            hover:shadow-xl/5 hover:border-primary hover:-translate-y-1"
          >
            <div
              class="relative md:absolute md:-top-8 flex items-center justify-center rounded-xl
              md:rounded-2xl bg-primary/20 md:bg-primary shadow-md w-14 h-14"
            >
              <p class="text-primary md:text-white text-4xl md:text-3xl font-black">
                {{ index + 1 }}
              </p>
            </div>
            <div class="flex flex-col md:items-center text-left md:text-center mt-2 md:mt-5 space-y-1 z-1">
              <p class="font-bold text-black text-xl">
                {{ step.title }}
              </p>
              <p class="max-w-60 text-sm text-black/80">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div data-aos="fade-up" class="px-3 md:px-0">
        <ButtonPrimary
          @click="() => navigateToApply(router)"
          label="Оформить заявку"
          class="xs:max-w-72 mx-auto !text-md"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .how-to-section {
    box-shadow: 0 0 24px -10px rgba(0, 0, 0, 0.08);
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>

