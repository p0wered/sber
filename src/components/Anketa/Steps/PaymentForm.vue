<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUtmSource } from "@/utils/common.ts";
  import { CopyX } from 'lucide-vue-next';
  import { config } from "@/config.ts";
  import axios from 'axios';
  import CheckboxPrimary from "@/components/Common/Checkboxes/CheckboxPrimary.vue";
  import PaymentLoadingCard from '@/components/PaymentLoadingCard.vue';
  import ApplyVerified from "@/components/Anketa/ApplyVerified.vue";

  const router = useRouter();
  const paymentLink = ref<string | null>(null);
  const hasError = ref(false);
  const { hasUtmSource } = useUtmSource();
  const showTerminal = ref(false);
  const isLoadingPayment = ref(true);
  const paymentLoadingCardRef = ref<{ completeLoading: () => void } | null>(null);
  const iframeLoaded = ref(false);
  const countdown = ref(5);
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const startRedirectCountdown = () => {
    countdown.value = 5;
    countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        router.push('/apply/companys');
      }
    }, 1000);
  };

  onUnmounted(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  });

  const onIframeLoad = () => {
    iframeLoaded.value = true;
    if (isLoadingPayment.value && paymentLoadingCardRef.value) {
      paymentLoadingCardRef.value.completeLoading();
    }
    setTimeout(() => {
      isLoadingPayment.value = false;
    }, 300);
  };

  onMounted(async () => {
    if (hasUtmSource.value) {
      showTerminal.value = true;
    }

    const uid = localStorage.getItem('lead_id');

    if (!uid) {
      console.error('Ошибка: lead_id не найден в localStorage.');
      hasError.value = true;
      isLoadingPayment.value = false;
      startRedirectCountdown();
      return;
    }

    const apiUrl = `https://payment.mfo-0.ru/web_form?sid=${config.siteId}&uid=${uid}&cid=${config.cid}`;

    try {
      const response = await axios.get(apiUrl);
      if (response.data && response.data.status === 'success' && response.data.link) {
        paymentLink.value = response.data.link;
        hasError.value = false;

        if (!showTerminal.value) {
          if (paymentLoadingCardRef.value) {
            paymentLoadingCardRef.value.completeLoading();
          }
          setTimeout(() => {
            isLoadingPayment.value = false;
          }, 500);
        }
      } else {
        console.error('API response error or invalid format:', response.data);
        hasError.value = true;
        isLoadingPayment.value = false;
        startRedirectCountdown();
      }
    } catch (error) {
      console.error('Error fetching payment terminal:', error);
      hasError.value = true;
      isLoadingPayment.value = false;
      startRedirectCountdown();
    }
  });

  watch(showTerminal, (newVal) => {
    if (newVal && paymentLink.value && !iframeLoaded.value) {
      isLoadingPayment.value = true;
    }
  });
</script>

<template>
  <ApplyVerified/>

  <p v-if="!hasUtmSource" class="font-bold text-lg mb-4 mx-auto">
    Оформление подписки и активация платной подписки по вашей карте стоимостью
    {{ $config.sum }} рублей в месяц.
  </p>

  <div class="mb-2" v-if="!hasUtmSource">
    <CheckboxPrimary v-model="showTerminal">
      <p class="text-sm text-black">
        Сервис осуществляет подбор микрозаймов между лицом, желающим оформить займ, и кредитными учреждениями.
        <span class="font-bold">
          Вы оформляете подписку стоимостью {{ $config.sum }} рублей в месяц согласно тарифам.
        </span>
        Для отписки воспользуйтесь кнопкой отписки на главной странице сайта или на странице
        <a href="/unsubscribe">отписки.</a>
      </p>
    </CheckboxPrimary>
  </div>

  <div
    v-if="showTerminal"
    class="payment-terminal mt-2 rounded-xl border border-gray-200 overflow-hidden">
    <div
      v-if="hasError"
      class="flex flex-col items-center py-18 bg-secondary rounded-md"
    >
      <div class="flex items-center gap-2">
        <p class="text-red-600 text-[20px] md:text-[24px] font-semibold">Ошибка</p>
        <CopyX class="text-red-600"/>
      </div>
      <p class="text-gray-500 text-sm mt-4 text-center">
        Не удалось загрузить платежный терминал
      </p>
      <p class="text-gray-500 text-sm mt-2 text-center px-2">
        Вы будете перенаправлены на страницу предложений через {{ countdown }}...
      </p>
    </div>
    <div v-else>
      <div v-if="isLoadingPayment">
        <PaymentLoadingCard ref="paymentLoadingCardRef"/>
      </div>
      <div v-if="paymentLink">
        <iframe
          :src="paymentLink"
          class="rounded-md"
          width="100%"
          height="660px"
          allowfullscreen
          @load="onIframeLoad"
          v-show="showTerminal && iframeLoaded"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* не удалять, нужно для transition */

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
}
</style>