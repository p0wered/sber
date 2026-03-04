<script setup lang="ts">
  import { useAutoDocs } from "@/utils/auto-docs.ts";
  import { onBeforeUnmount, onMounted } from "vue";
  import {
    AlertTriangle,
    CheckCircle,
    CreditCard,
    FileText,
    Folder,
    Mail,
    MapPin,
    Phone,
    Shield
  } from 'lucide-vue-next';

  onMounted(() => {
    document.body.style.overflow = 'hidden';
  });

  onBeforeUnmount(() => {
    document.body.style.overflow = '';
  });

  const emit = defineEmits(['close']);

  const {
    publicOfertaPdf,
    personalDataPoliticPdf,
    personalDataAgreementPdf,
    paidSubAgreementPdf,
    recurrPaymentsAgreementPdf,
    cardDataAgreementPdf
  } = useAutoDocs();
</script>

<template>
  <div class="subscription-popup-overlay fixed
  inset-0 z-[9999] flex items-center justify-center
  p-3 sm:p-4 md:p-6">

    <div class="subscription-popup absolute h-[130vh] inset-0 bg-black/50 backdrop-blur-md"/>

    <div class="relative w-full max-w-4xl bg-white
    rounded-3xl shadow-2xl border border-stone-200/50
    overflow-hidden">
      <div class="max-h-[95dvh] overflow-y-auto">
        <div class="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          <div class="text-center space-y-4 sm:space-y-6">
            <div class="flex items-center justify-center gap-3 sm:gap-4">
              <div class="p-2 sm:p-3 bg-gradient-to-br
              from-amber-100 to-orange-100 rounded-2xl">
                <CreditCard class="w-6 h-6 sm:w-7 sm:h-7 text-amber-600"/>
              </div>
              <h1 class="text-lg md:text-xl text-left md:text-center
              font-bold text-stone-900 leading-tight max-w-2xl">
                ВНИМАНИЕ: УСЛУГА ПРЕДОСТАВЛЯЕТСЯ ПО ПОДПИСКЕ
              </h1>
            </div>
          </div>

          <div class="space-y-6 sm:space-y-8 text-stone-700">
            <div class="bg-gradient-to-br from-amber-50 to-orange-50 border
            border-amber-200/50 rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div class="text-center">
                <p class="text-lg md:text-xl font-semibold text-stone-900">
                  <span>{{ $config.sum }} ₽</span>
                  <span class="text-sm sm:text-base font-normal text-stone-600 ml-2">
                    / каждые 30 дней
                  </span>
                </p>
              </div>
              <div class="bg-white/70 rounded-xl p-3 sm:p-4">
                <p class="text-sm sm:text-base text-center text-stone-700 leading-relaxed">
                  Списание производится автоматически с вашей карты до отмены подписки
                </p>
              </div>
            </div>

            <div class="space-y-4 sm:space-y-6 ">
              <div class="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-stone-50 rounded-2xl
              border border-stone-300/50">
                <div class="p-2 bg-blue-100 rounded-xl flex-shrink-0 mt-1 hidden sm:block">
                  <FileText class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"/>
                </div>
                <div class="space-y-3">
                  <p class="text-sm sm:text-base font-semibold text-stone-900">
                    Нажимая кнопку, вы соглашаетесь с:
                  </p>
                  <div class="flex flex-wrap gap-2 sm:gap-3">
                    <a
                      v-if="publicOfertaPdf"
                      :href="publicOfertaPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2
                      bg-white border border-stone-200 rounded-xl hover:border-amber-300
                      hover:bg-amber-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-stone-700 hover:text-amber-700">
                      Соглашением (офертой) об использовании Интернет-сервиса
                    </a>
                    <a
                      v-if="personalDataPoliticPdf"
                      :href="personalDataPoliticPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2
                      bg-white border border-stone-200 rounded-xl hover:border-amber-300
                      hover:bg-amber-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-stone-700 hover:text-amber-700">
                      Политикой обработки персональных данных
                    </a>
                    <a
                      v-if="personalDataAgreementPdf"
                      :href="personalDataAgreementPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2
                      bg-white border border-stone-200 rounded-xl hover:border-amber-300
                      hover:bg-amber-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-stone-700 hover:text-amber-700">
                      Согласием на обработку персональных данных
                    </a>
                    <a
                      v-if="paidSubAgreementPdf"
                      :href="paidSubAgreementPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2
                      bg-white border border-stone-200 rounded-xl hover:border-amber-300
                      hover:bg-amber-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-stone-700 hover:text-amber-700">
                      Соглашение на оформление платной подписки
                    </a>
                    <a
                      v-if="recurrPaymentsAgreementPdf"
                      :href="recurrPaymentsAgreementPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border
                      border-stone-200 rounded-xl hover:border-amber-300 hover:bg-amber-50
                      transition-all duration-200 text-sm sm:text-base font-medium
                      text-stone-700 hover:text-amber-700">
                      Соглашение на применение Рекуррентных платежей
                    </a>
                    <a
                      v-if="cardDataAgreementPdf"
                      :href="cardDataAgreementPdf"
                      target="_blank"
                      class="inline-flex items-center gap-2 px-3 sm:px-4 py-2
                      bg-white border border-stone-200 rounded-xl hover:border-amber-300
                      hover:bg-amber-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-stone-700 hover:text-amber-700">
                      Соглашение о хранении учётных данных владельцы карт
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3 sm:gap-4 p-4 sm:p-6
              bg-green-50 rounded-2xl border border-green-200/50">
                <div class="p-2 bg-green-100 rounded-xl flex-shrink-0 mt-1 hidden sm:block">
                  <MapPin class="w-4 h-4 sm:w-5 sm:h-5 text-green-600"/>
                </div>
                <div class="space-y-2">
                  <p class="text-sm sm:text-base font-semibold text-stone-900">
                    Подписку можно отменить в любой момент
                  </p>
                  <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
                    на сайте или через поддержку:
                  </p>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <a
                      :href="'tel:' + $config.phoneNumber"
                      class="inline-flex items-center gap-2 px-4 py-3
                      bg-white border border-green-200 rounded-xl hover:border-green-300
                      hover:bg-green-50 transition-all duration-200 text-sm sm:text-base
                      font-medium text-green-700"
                    >
                      <Phone class="w-4 h-4"/>
                      {{ $config.phoneNumber }}
                    </a>
                    <a
                      :href="'mailto:' + $config.email"
                      class="inline-flex items-center gap-2 px-4 py-3
                      bg-white border border-green-200 rounded-xl
                      hover:border-green-300 hover:bg-green-50 transition-all
                      duration-200 text-sm sm:text-base font-medium text-green-700"
                    >
                      <Mail class="w-4 h-4"/>
                      {{ $config.email }}
                    </a>
                    <a
                      href="/unsubscribe"
                      class="inline-flex items-center gap-2 px-4 py-3
                      bg-white border border-green-200 rounded-xl
                      hover:border-green-300 hover:bg-green-50 transition-all
                      duration-200 text-sm sm:text-base font-medium text-green-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-circle-x w-4 h-4"
                      ><circle 
                         cx="12"
                         cy="12"
                         r="10"></circle>
                        <path d="m15 9-6 6"></path>
                        <path d="m9 9 6 6"></path>
                      </svg>
                      Отписаться
                    </a>
                  </div>
                </div>
              </div>

              <div
                class="bg-gradient-to-br from-blue-50 to-indigo-50  border
                border-blue-200/50 rounded-2xl p-4 sm:p-6">
                <div class="flex items-start gap-3 sm:gap-4">
                  <div class="p-2 bg-blue-100 rounded-xl flex-shrink-0 mt-1 sm:block hidden">
                    <Shield class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"/>
                  </div>
                  <div>
                    <p class="text-sm sm:text-base font-semibold text-stone-900">
                      Вы принимаете условия подписки осознанно, добровольно и информированно. Мы фиксируем факт
                      согласия.
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-red-50 to-orange-50 border
              border-red-200/50 rounded-2xl p-4 sm:p-6">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="p-2 bg-red-100 rounded-xl flex-shrink-0 mt-1 hidden sm:block">
                    <AlertTriangle class="w-4 h-4 sm:w-5 sm:h-5 text-red-600"/>
                  </div>
                  <div>
                    <p class="text-base sm:text-lg font-semibold text-red-900">
                      Если вы не согласны с условиями
                    </p>
                    <p class="text-sm sm:text-base text-red-700 leading-relaxed">
                      не используйте сайт и не вводите данные
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-stone-50 to-stone-100 border
            border-stone-300/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div class="flex items-center gap-3 sm:gap-4">
                <div class="p-2 sm:p-3 bg-stone-200 rounded-xl">
                  <Folder class="w-5 h-5 sm:w-6 sm:h-6 text-stone-600"/>
                </div>
                <h3 class="text-[18px] sm:text-[20px] font-bold text-stone-900">
                  Важная информация
                </h3>
              </div>
              <div class="space-y-3 sm:space-y-4 pl-3">
                <div class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"/>
                  <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
                    Ваше согласие логируется: IP, время, устройство, факт подтверждения
                  </p>
                </div>
                <div class="flex items-start gap-3">
                  <div class="w-2 h-2 bg-stone-400 rounded-full mt-2 flex-shrink-0"/>
                  <p class="text-sm sm:text-base text-stone-600 leading-relaxed">
                    В случае необоснованных жалоб или злоупотреблений, данные будут переданы в
                    поднадзорные органы и использованы для защиты нашей правовой позиции
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="$emit('close')"
            class="accept-btn cursor-pointer w-full bg-primary
            text-white font-semibold py-5 sm:py-6 px-4 sm:px-8 rounded-2xl
            text-base shadow-lg hover:shadow-xl transition-all duration-300
            transform hover:scale-[1.02] active:scale-[0.98] flex items-center
            justify-center gap-2"
          >
            <CheckCircle class="w-6 h-6 sm:w-7 sm:h-7 hidden md:block"/>
            <span class="leading-tight">
              Я ознакомлен с условиями подписки и согласен на регулярные списания
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
