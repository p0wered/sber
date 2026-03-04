<script setup lang="ts">
  import { ref } from 'vue';
  import { ChevronDown } from 'lucide-vue-next';

  interface FaqItem {
    question: string;
    answer: string;
  }

  const faqs: FaqItem[] = [
    {
      question: 'Как оформить услугу?',
      answer: 'Просто заполните анкету, активируйте заявку и действуйте по следующим инструкциям. После оформления ' +
      'в любой из предложенной нашим сервисом микрофинансовой организации деньги зачислятся на ваш счет уже в день ' +
      'обращения. Обычно процесс оформления заявки максимально упрощен и занимает всего несколько минут. В анкете ' +
      'указывайте только настоящую информацию. При использовании ложной информации вероятность отказа многократно ' +
      'увеличивается.'
    },
    {
      question: 'Какими способами можно получить деньги?',
      answer: 'Деньги можно получить максимально широкими способами: на карту Российского банка, на электронный ' +
      'кошелек, наличными в отделениях партнеров. Конкретный список способов получения будет доступен после ' +
      'оформления в выбранной вами МФО.'
    },
    {
      question: 'У меня плохая кредитная история',
      answer: 'Мы понимаем, что ситуации могут быть разными, и работаем со всеми клиентами — даже при наличии ' +
      'плохой кредитной истории подберём удобный заём с выгодными условиями. А вовремя выплаченные займы помогают ' +
      'улучшить вашу кредитную историю!'
    },
    {
      question: 'Какие требования к заемщику?',
      answer: 'Вам должно быть 18 лет и у вас должна иметься банковская карта - больше нет никаких требований.'
    },
    {
      question: 'Какая процентная ставка?',
      answer: 'На первый займ микрофинансовые организации практически всегда предоставляют возможность взять деньги ' +
      'под 0%. На повторные выдачи процентная ставка может быть от 0.01%, все зависит от выбранной вами МФО.'
    },
    {
      question: 'Как закрыть задолженность?',
      answer: 'Закрыть займ можно любым доступным способом: наличными деньгами, банковским переводом, платежом с ' +
      'банковской карты. После получения займа вы получите все необходимые реквизиты для погашения займа в выбранной ' +
      'вами МФО.'
    },
    {
      question: 'Что делать, если я больше не пользуюсь услугами?',
      answer: 'Если услуги сервиса для вас более не актуальны, вам необходимо перейти ' +
      '<a href="/unsubscribe">по ссылке</a> и следовать дальнейшей инструкции, ' +
      'либо обратитесь в службу поддержки удобным для вас способом.'
    }
  ];

  const openIndex = ref<number | null>(0);

  function toggle(idx: number) {
    openIndex.value = openIndex.value === idx ? null : idx;
  }

  function onEnter(el: Element) {
    const element = el as HTMLElement;
    const content = element.querySelector('div') as HTMLElement;
    element.style.height = '0';
    if (content) content.style.opacity = '0';
    element.offsetHeight;
    element.style.height = element.scrollHeight + 'px';
    if (content) content.style.opacity = '1';
  }

  function onAfterEnter(el: Element) {
    const element = el as HTMLElement;
    element.style.height = 'auto';
  }

  function onLeave(el: Element) {
    const element = el as HTMLElement;
    const content = element.querySelector('div') as HTMLElement;
    element.style.height = element.scrollHeight + 'px';
    if (content) content.style.opacity = '0';
    element.offsetHeight;
    element.style.height = '0';
  }
</script>

<template>
  <section id="faq">
    <div class="max-w-6xl mx-auto px-3 md:px-8 py-12 md:py-16">
      <div class="text-left md:text-center px-2 mb-6" data-aos="fade-up">
        <h2 class="text-3xl md:text-5xl font-black">
          Ваши вопросы - наши ответы
        </h2>
        <p class="text-md md:text-lg mt-2 text-black/60">
          Чтобы все было прозрачно и понятно, отвечаем на часто задаваемые вопросы
        </p>
      </div>

      <div
        class="grid gap-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div
          v-for="(item, idx) in faqs"
          :key="item.question"
          class="rounded-3xl border border-gray-200 bg-white transition"
          :class="{ '!border-primary shadow-lg scale-102': openIndex === idx }"
        >
          <button
            type="button"
            class="w-full flex items-center justify-between gap-4 p-5 md:p-7 text-left
            select-none cursor-pointer rounded-t-3xl"
            :aria-expanded="openIndex === idx"
            :aria-controls="`faq-panel-${idx}`"
            @click="toggle(idx)"
          >
            <span class="text-lg md:text-xl font-semibold">
              {{ item.question }}
            </span>
            <ChevronDown
              class="h-5 w-5 shrink-0 transition-transform duration-150 ease-out"
              :class="{ 'rotate-180 text-primary': openIndex === idx, 'text-black/60': openIndex !== idx }"
            />
          </button>

          <Transition
            name="accordion"
            @enter="onEnter"
            @after-enter="onAfterEnter"
            @leave="onLeave"
          >
            <div
              v-show="openIndex === idx"
              :id="`faq-panel-${idx}`"
              role="region"
              class="accordion-content"
            >
              <div class="px-5 md:px-7 pb-5 md:pb-7 text-sm md:text-lg text-black/70" v-html="item.answer"/>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .accordion-content {
    overflow: hidden;
    transition: height 0.2s ease-out;
  }

  .accordion-content > div {
    transition: opacity 0.15s ease-out;
  }

  .accordion-content :deep(a) {
    color: var(--color-primary);
    transition: opacity 0.2s;
  }

  .accordion-content :deep(a:hover) {
    opacity: 0.8;
  }
</style>