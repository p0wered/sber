<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { getFullNameParts } from "@/utils/common.ts";
  import { config } from "@/config.ts";
  import router from "@/router";
  import axios from 'axios';
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import ButtonSecondary from "@/components/Common/Buttons/ButtonSecondary.vue";
  import LoadingSpinner from "@/components/LoadingSpinner.vue";

  const recurr_payments_agreement = ref('');
  const sogl_podpiska = ref('');
  const sogl_obrab = ref('');

  const modalBody = ref<HTMLElement | null>(null);
  const scrolledToBottom = ref(false);
  const isLoading = ref(true);

  let scrollAnimationId: number | null = null;
  const duration = 10000;

  const userCredentials = computed(() => ({
    passportData: localStorage.getItem('passportData') || '',
    passportDateIssue: localStorage.getItem('passportDateIssue') || '',
    passportDepCode: localStorage.getItem('passportDepCode') || '',
    phone: localStorage.getItem('phone') || ''
  }));

  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    }
  });

  const emit = defineEmits(['accept']);

  const documentStyles = `
    .info-doc { text-align: right; margin-bottom: 20px; }
    .position-right { text-align: right; }
    .position-center { text-align: center; }
    .signature-table { margin-left: auto; }
    .seal-img, .signature-img { display: inline-block; }
    .signature-text { text-align: right; }
    .info-item { margin: 2px 0; }
    .pd-date { margin: 2px 0; }
    h1 { font-size: 18px; font-weight: bold; margin: 20px 0; text-align: center; }
    p { margin: 8px 0; line-height: 1.4; }
    body { font-family: Arial, sans-serif; font-size: 12px; }
  `;

  const createDocument = (content: string, title: string) => `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>${documentStyles}</style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;

  const document1 = computed(() =>
      createDocument(recurr_payments_agreement.value, "Соглашение на рекуррентные платежи")
  );

  const document2 = computed(() =>
      createDocument(sogl_podpiska.value, "Соглашение на оформление платной подписки")
  );

  const document3 = computed(() =>
      createDocument(sogl_obrab.value, "Согласие на обработку персональных данных")
  );

  const loadDocuments = async () => {
    isLoading.value = true;
    try {
      const nameParts = getFullNameParts();
      const response = await axios.post('https://docs.infg.tech/get/render/template', {
        slug: ["sogl_podpiska", "recurr_payments_agreement", "sogl_obrab"],
        clones: [config.cid],
        add_data: {
          ...userCredentials.value,
          user_last_name: nameParts.lastName,
          user_first_name: nameParts.firstName,
          user_patronymic: nameParts.patronymic
        }
      });

      const {
        recurr_payments_agreement: recurr,
        sogl_podpiska: sogl,
        sogl_obrab: obrab
      } = response.data.result;

      recurr_payments_agreement.value = recurr;
      sogl_podpiska.value = sogl;
      sogl_obrab.value = obrab;
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const checkScrollPosition = () => {
    if (!modalBody.value) return;

    const { scrollTop, scrollHeight, clientHeight } = modalBody.value;
    const threshold = 10;
    scrolledToBottom.value = scrollTop + clientHeight >= scrollHeight - threshold;
  };

  const onScroll = () => checkScrollPosition();

  const checkScrollRequirement = () => {
    nextTick(() => {
      if (modalBody.value) {
        const { scrollHeight, clientHeight } = modalBody.value;
        scrolledToBottom.value = scrollHeight <= clientHeight;
      }
    });
  };

  function animateScrollTo(target: number, duration: number) {
    if (!modalBody.value) return;

    if (scrollAnimationId !== null) {
      cancelAnimationFrame(scrollAnimationId);
    }

    const start = performance.now();
    const startY = modalBody.value.scrollTop;
    const maxScroll = modalBody.value.scrollHeight - modalBody.value.clientHeight;
    const remaining = target - startY;

    if (remaining <= 0) {
      scrollAnimationId = null;
      return;
    }

    const animDuration = duration * (remaining / maxScroll);

    const step = (time: number) => {
      const elapsed = time - start;
      let t = elapsed / animDuration;
      if (t > 1) t = 1;

      modalBody.value!.scrollTop = startY + remaining * t;

      if (t < 1) {
        scrollAnimationId = requestAnimationFrame(step);
      } else {
        scrollAnimationId = null;
      }
    };

    scrollAnimationId = requestAnimationFrame(step);
  }

  function cancelScrollAnimation() {
    if (scrollAnimationId !== null) {
      cancelAnimationFrame(scrollAnimationId);
      scrollAnimationId = null;
    }
  }

  const handleAccept = () => {
    if (!modalBody.value) return;
    const { scrollTop, clientHeight, scrollHeight } = modalBody.value;
    const threshold = 10;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (!isAtBottom) {
      animateScrollTo(scrollHeight, duration);
    } else {
      emit('accept');
    }
  };

  watch(
    [recurr_payments_agreement, sogl_podpiska, sogl_obrab],
    ([val1, val2, val3]) => {
      if (props.show && val1 && val2 && val3) {
        checkScrollRequirement();
      }
    }
  );

  watch(
    () => props.show,
    (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden';
        scrolledToBottom.value = false;
        loadDocuments();
      } else {
        document.body.style.overflow = '';
      }
    }
  );

  onMounted(() => {
    if (!modalBody.value) return;

    if (props.show) {
      scrolledToBottom.value = false;
      loadDocuments();
    }
    modalBody.value.addEventListener('wheel', cancelScrollAnimation, { passive: true });
    modalBody.value.addEventListener('touchstart', cancelScrollAnimation, { passive: true });
  });

  onBeforeUnmount(() => {
    if (!modalBody.value) return;
    modalBody.value.removeEventListener('wheel', cancelScrollAnimation);
    modalBody.value.removeEventListener('touchstart', cancelScrollAnimation);
    document.body.style.overflow = '';
  });
</script>


<template>
  <div
    v-if="props.show"
    class="agreement-popup-overlay fixed
    inset-0 bg-black/50 backdrop-blur-md
    flex justify-center items-center z-[1000]"
  >
    <div class="agreement-popup bg-gray-50
    rounded-xl shadow-md w-[95%] max-w-[840px]
    max-h-[95dvh] flex flex-col overflow-hidden"
    >
      <div v-if="!scrolledToBottom" class="text-center py-3 bg-primary/15 text-primary text-sm animate-pulse">
        Пролистайте вниз, чтобы активировать кнопку
      </div>

      <div
        class="flex-1 overflow-y-auto md:p-5"
        ref="modalBody"
        @scroll="onScroll"
        @wheel.passive="cancelScrollAnimation"
        @touchstart.passive="cancelScrollAnimation"
      >
        <div v-if="isLoading" class="flex justify-center items-center h-full">
          <LoadingSpinner size="48px" class="text-primary"/>
        </div>

        <div v-else class="flex flex-col gap-5">
          <div class="border border-gray-200 bg-white md:rounded-lg p-5" v-html="document1"/>
          <div class="border border-gray-200 bg-white md:rounded-lg p-5" v-html="document2"/>
          <div class="border border-gray-200 bg-white md:rounded-lg p-5" v-html="document3"/>
        </div>
      </div>

      <div class="bg-white flex flex-col sm:flex-row gap-2 md:gap-3 p-2 md:p-5  border-t border-gray-200">
        <ButtonSecondary
          class="bg-gray-200 hover:bg-gray-300 text-black/70 w-full py-4"
          :is-loading="isLoading"
          @click="router.push('/')"
          label="Отказываюсь"
        />
        <ButtonPrimary
          class="w-full"
          @click="handleAccept"
          :is-loading="isLoading"
          :label="!scrolledToBottom ? 'Ознакомиться' : 'Принимаю'"
        />
      </div>
    </div>
  </div>
</template>
