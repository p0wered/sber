<script setup lang="ts">
  import { markRaw } from 'vue';
  import { useRouter } from "vue-router";
  import { navigateToApply } from "@/utils/common.ts";
  import { ShoppingCart, TrendingUp, Wallet } from 'lucide-vue-next';
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import Option1 from "@/assets/images/options/option-1.png";
  import Option2 from "@/assets/images/options/option-2.png";
  import Option3 from "@/assets/images/options/option-3.png";

  const router = useRouter();

  const loanOptions = [
    {
      icon: markRaw(ShoppingCart),
      image: Option1,
      tag: 'Для покупок',
      titlePrefix: 'Займ от лучшей МФО до',
      titlePrice: '30\u00A0000\u00A0₽',
      subtitle: 'На маленькие мелочи и полезные приятности',
      features: [
        { label: 'До 30\u00A0000\u00A0₽', description: 'Улучшаем кредитную историю' },
        { label: 'Без процентов', description: 'Для старых и новых клиентов' },
        { label: 'Быстро', description: 'Это займёт не более 7 минут' }
      ]
    },
    {
      icon: markRaw(Wallet),
      image: Option2,
      tag: 'На любые расходы',
      titlePrefix: 'Займ от лучшей МФО до',
      titlePrice: '50\u00A0000\u00A0₽',
      subtitle: 'На отпуск, технику или неотложные нужды',
      features: [
        { label: 'До 50\u00A0000\u00A0₽', description: 'Увеличенный лимит для вас' },
        { label: 'Низкая ставка', description: 'Выгодные условия от партнёров' },
        { label: 'Удобно', description: 'Деньги на карту за 15 минут' }
      ]
    },
    {
      icon: markRaw(TrendingUp),
      image: Option3,
      tag: 'На крупные цели',
      titlePrefix: 'Займ от лучшей МФО до',
      titlePrice: '100\u00A0000\u00A0₽',
      subtitle: 'На ремонт, обучение или важные проекты',
      features: [
        { label: 'До 100\u00A0000\u00A0₽', description: 'Максимальная сумма на карту' },
        { label: 'Гибкие сроки', description: 'Погашение до 12 месяцев' },
        { label: 'Без залога', description: 'Только карта и заявка' }
      ]
    }
  ];
</script>

<template>
  <div class="w-full bg-secondary z-2">
    <div class="w-full max-w-6xl mx-auto px-3 md:px-8 py-12">
      <div
        data-aos="fade-up"
        class="text-left md:text-center mb-4 md:mb-8 px-4"
      >
        <h2 class="font-bold md:font-black text-3xl md:text-5xl">
          Какие у нас бывают займы?
        </h2>

        <p class="text-md md:text-lg mt-2 text-black/60">
          Всегда найдём самые выгодные условия
        </p>
      </div>

      <div class="flex flex-col gap-3 md:gap-5">
        <div
          v-for="(option, index) in loanOptions"
          :key="index"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
        >
          <div
            class="bg-option relative bg-white border border-gray-200 flex flex-col
          justify-between gap-4 md:gap-6 p-6 xs:p-8 min-h-136 md:min-h-[320px] rounded-3xl overflow-hidden
          max-w-120 md:max-w-none mx-auto hover:border-primary/80 hover:-translate-y-1 hover:shadow-xl/5
          transition"
            :style="{ backgroundImage: `url(${option.image})` }"
          >
            <div class="flex flex-col gap-3 items-start">
              <div
                class="bg-gray-200/70 w-fit text-neutral-700 flex justify-center
              items-center gap-2 py-1.5 px-3 rounded-full mb-2"
              >
                <component
                  :is="option.icon"
                  class="w-4 h-4"
                  :stroke-width="1.5"
                />

                <p class="text-xs">
                  {{ option.tag }}
                </p>
              </div>

              <div class="space-y-1.5">
                <h4 class="max-w-82 lg:max-w-none text-xl md:text-3xl font-bold">
                  {{ option.titlePrefix }} <span class="whitespace-nowrap">{{ option.titlePrice }}</span>
                </h4>

                <p class="text-sm md:text-base text-black/80">
                  {{ option.subtitle }}
                </p>
              </div>
            </div>

            <div class="hidden lg:flex gap-7 lg:gap-14">
              <div
                v-for="(feature, fIndex) in option.features"
                :key="fIndex"
                class="max-w-34"
              >
                <p class="font-bold">
                  {{ feature.label }}
                </p>

                <p class="text-sm text-black/80">
                  {{ feature.description }}
                </p>
              </div>
            </div>

            <ButtonPrimary
              @click="() => navigateToApply(router)"
              label="Оформить заявку"
              class="relative z-10 max-w-none md:max-w-56 mx-auto md:mx-0 !text-md"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bg-option {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom right;
    background-clip: padding-box;
  }

  @media screen and (max-width: 769px) {
    .bg-option {
      background-size: 95%;
      background-position: bottom center;
      background-position-y: 130px;
    }

    .bg-option::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 10%;
      background: white;
      pointer-events: none;
      z-index: 1;
    }

    .bg-option::after {
      content: '';
      position: absolute;
      bottom: 10%;
      left: 0;
      right: 0;
      height: 20%;
      background: linear-gradient(to bottom, transparent, #ffffff);
      pointer-events: none;
      z-index: 1;
    }
  }

  @media screen and (max-width: 450px) {
    .bg-option {
      background-size: 120%;
      background-position: bottom center;
      background-position-y: 145px;
    }
  }

  @media screen and (max-width: 385px) {
    .bg-option {
      background-size: 120%;
      background-position: bottom center;
      background-position-y: 140px;
    }
  }
</style>