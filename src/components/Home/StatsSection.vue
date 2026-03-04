<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useUtmSource } from "@/utils/common.ts";
  import { CheckCircle, Coins, Info, TrendingUp, Users } from 'lucide-vue-next';

  interface StatCard {
    target: number;
    suffix: string;
    label: string;
    icon: typeof TrendingUp;
  }

  const stats: StatCard[] = [
    { target: 197721147, suffix: ' ₽', label: 'Общая сумма займов', icon: TrendingUp },
    { target: 4279, suffix: '', label: 'Одобренных займов', icon: CheckCircle },
    { target: 46431, suffix: ' ₽', label: 'Средняя сумма займа', icon: Coins }
  ];

  const { hasUtmSource } = useUtmSource();
  const displayValues = ref<string[]>(stats.map(() => '0'));
  const sectionRef = ref<HTMLElement | null>(null);
  let animated = false;

  function formatNumber(n: number): string {
    return n.toLocaleString('ru-RU');
  }

  function animateCounters() {
    if (animated) return;
    animated = true;

    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      stats.forEach((stat, i) => {
        const current = Math.floor(stat.target * ease);
        displayValues.value[i] = formatNumber(current) + stat.suffix;
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer?.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.value) {
      observer.observe(sectionRef.value);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });
</script>

<template>
  <section ref="sectionRef" class="overflow-hidden">
    <div class="w-full max-w-6xl mx-auto px-3 md:px-8 py-12">
      <div class="text-left md:text-center mb-6 px-2" data-aos="fade-up">
        <h2 class="text-3xl md:text-5xl font-black">
          Наш сервис в цифрах
        </h2>
        <p class="text-md md:text-lg mt-2 text-black/60">
          Ежедневно помогаем людям решать финансовые вопросы
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div
          data-aos="fade-up"
          class="md:col-span-2 md:row-span-3"
        >
          <div class="rounded-3xl border border-gray-200 bg-white p-6 lg:p-8 flex flex-col gap-5 h-full">
            <div class="flex items-center gap-4">
              <div class="w-15 h-15 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users class="w-8 h-8 text-primary" :stroke-width="1.5" />
              </div>
              <div>
                <p class="text-3xl lg:text-4xl font-bold text-primary">
                  9 407+
                </p>
                <p class="text-sm text-black/50 font-medium">
                  человек рекомендуют
                </p>
              </div>
            </div>

            <p class="text-black/70 text-sm md:text-base leading-relaxed max-w-lg">
              Наш сервис рекомендуют более 9407 человек. Ежедневно мы помогаем получить займ
              и работаем для того, чтобы каждый клиент получил желаемую сумму.
            </p>

            <div
              v-if="!hasUtmSource"
              class="mt-auto rounded-2xl bg-black/4 p-4 flex items-start gap-3"
            >
              <Info class="w-5 h-5 text-black/40 shrink-0 mt-0.5" :stroke-width="1.5" />
              <div>
                <p class="text-sm text-black/70 leading-relaxed">
                  Услуга обработки заявки платная и составляет
                  <span class="font-bold text-black">{{ $config.sum }}₽</span>
                  каждые тридцать дней. Подробная информация размещена
                  в&nbsp;разделе
                  <a href="/about" class="text-primary font-medium hover:opacity-70 transition">
                    О сервисе</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-for="(stat, idx) in stats"
          :key="stat.label"
          data-aos="fade-up"
          :data-aos-delay="(idx + 1) * 50"
        >
          <div
            class="rounded-3xl border border-gray-200 hover:shadow-xl/5 bg-white p-5
            flex flex-col gap-2 h-full transition hover:-translate-y-1 hover:border-primary"
          >
            <div class="flex gap-3 items-center mb-1 md:mb-3">
              <div class="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center">
                <component
                  :is="stat.icon"
                  class="w-5 h-5 text-primary"
                  :stroke-width="1.5"
                />
              </div>
              <p class="text-2xl lg:text-3xl font-bold tracking-tight">
                {{ displayValues[idx] }}
              </p>
            </div>
            <p class="text-md text-black/50">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .marquee-track {
    display: flex;
    width: max-content;
  }

  .marquee-content {
    display: flex;
    animation: marquee 25s linear infinite;
  }

  .marquee-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 24px;
    position: relative;
  }

  .marquee-item::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-track:hover .marquee-content {
    animation-play-state: paused;
  }
</style>
