<script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useUtmSource } from "@/utils/common.ts";
  import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-vue-next';
  import LogoWhite from '@/assets/images/logo-white.svg';

  const { hasUtmSource } = useUtmSource();
  const router = useRouter();
</script>

<template>
  <footer class="bg-neutral-900 text-white lg:py-12 lg:px-4 p-8 w-full text-base font-normal">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 gap-4">
        <div>
          <div class="flex items-center mb-4">
            <img
              class="w-40 h-10"
              :src="LogoWhite"
              alt="Logo"
            >
          </div>
          <p class="text-neutral-400 max-w-50">
            Быстрое решение финансовых вопросов без лишних документов и проверок
          </p>
        </div>
        <div>
          <h3 class="font-bold text-lg mb-4">Компания</h3>
          <ul class="lg:space-y-2 space-y-1">
            <li><a
              tabindex="0"
              @click="router.push('/about')"
              @keydown.enter="router.push('/about')"
              @keydown.space.prevent="router.push('/about')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              О нас
            </a></li>
            <li><a
              href="/login"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Личный кабинет
            </a></li>
            <li><a
              tabindex="0"
              @click="router.push('/unsubscribe')"
              @keydown.enter="router.push('/unsubscribe')"
              @keydown.space.prevent="router.push('/unsubscribe')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Отписаться
            </a></li>
            <li><a
              tabindex="0"
              @click="router.push('/apply/companys')"
              @keydown.enter="router.push('/apply/companys')"
              @keydown.space.prevent="router.push('/apply/companys')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Витрина
            </a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">Информация</h3>
          <ul class="lg:space-y-2 space-y-1">
            <li><a
              tabindex="0"
              @click="router.push('/documents')"
              @keydown.enter="router.push('/documents')"
              @keydown.space.prevent="router.push('/documents')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Документы
            </a></li>
            <li><a
              tabindex="0"
              @click="router.push('/contacts')"
              @keydown.enter="router.push('/contacts')"
              @keydown.space.prevent="router.push('/contacts')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Контакты и помощь
            </a></li>
            <li><a
              tabindex="0"
              @click="router.push('/payment')"
              @keydown.enter="router.push('/payment')"
              @keydown.space.prevent="router.push('/payment')"
              class="text-neutral-400 hover:text-primary focus:text-primary transition cursor-pointer">
              Оплата и безопасность
            </a></li>
          </ul>
        </div>

        <div>
          <h3 class="font-bold text-lg mb-4">Контакты</h3>
          <ul class="lg:space-y-2 space-y-1">
            <li class="flex items-center gap-3 text-neutral-400 hover:text-primary transition cursor-pointer">
              <Phone/>
              <a
                :href="`tel:${$config.phoneNumber}`">
                {{$config.phoneNumber}}
              </a>
            </li>
            <li class="flex items-center gap-3 text-neutral-400 hover:text-primary transition cursor-pointer">
              <Mail/>
              <a
                :href="`mailto:${$config.email}`">
                {{$config.email}}
              </a>
            </li>
            <li class="flex items-center">
              <MapPin class="mr-2 text-neutral-400 flex-shrink-0"/>
              <span class="text-neutral-400">{{$config.address}}</span>
            </li>
          </ul>
        </div>
      </div>

      <hr class="shrink-0 border-none w-full h-px my-8 bg-neutral-800">

      <div class="space-y-4 mb-4">
        <div class="flex items-center gap-3">
          <div
            class="border-3 border-red-600 text-red-600 text-xs rounded-full
            min-w-8 min-h-8 flex justify-center items-center">
            18+
          </div>
          <p class="font-bold text-neutral-500">
            Сервис предназначен для лиц старше 18 лет
          </p>
        </div>
        <div class="flex items-center gap-3">
          <ShieldCheck class="text-green-600 min-w-8 min-h-8"/>
          <div>
            <p class="font-bold text-neutral-500">
              Ваши данные под защитой
            </p>
            <p class="text-neutral-500 text-sm">
              {{ $config.type }} {{ $config.legalEntity }}
              является оператором персональных данных {{ $config.rknNumber }},
              Приказ №{{ $config.order }}.
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col justify-between gap-4">
        <p
          v-if="!hasUtmSource"
          class="text-neutral-500 text-sm mb-4 md:mb-0">
          У пользователей сервиса есть возможность получить займ с минимальной
          процентной ставкой одобренной МФО. Подробности при выборе
          персонального предложения. Займ у партнеров выдается в российских
          рублях гражданам Российской Федерации, на банковский счет, на карту
          или наличными. Минимальная сумма займа: 1 000 рублей. Максимальная
          сумма займа: 100 000 рублей. Процентная ставка и срок займа: по
          решению МФО. Услугу сервиса платного подбора займов предоставляет
          {{ $config.type }}
          {{ $config.legalEntity }}
          {{ $config.type === 'ООО' ? 'ОГРН:' : $config.type === 'ИП:' ? 'ОГРНИП:' : 'ОГРН/ОГРНИП:'}}
          {{ $config.individualEntrepreneurNumber }}, ИНН
          {{ $config.inn }}
        </p>
        <p
          v-if="!hasUtmSource"
          class="text-neutral-500 text-sm mb-4 md:mb-0">
          Платная подписка на подбор займов: стоимость подписки (далее по сайту
          — Активация сервиса) составляет {{ $config.sum }}
          рублей каждые тридцать дней (периодичность определяется тарифами
          сервиса и соглашением о применении рекуррентных платежей). Возможно
          списание частями! Активация сервиса не гарантирует вам получение
          займа.
        </p>
        <p
          v-if="!hasUtmSource"
          class="text-neutral-500 text-sm mb-4 md:mb-0">
          Перед тем, как брать займ — стоит ознакомиться!
        </p>
      </div>
    </div>
  </footer>
</template>
