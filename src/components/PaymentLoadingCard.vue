<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue';

  const progress = ref(0);
  const loadingText = ref('Инициализация...');
  const currentTip = ref(0);
  const currentFactIndex = ref(0);
  const clickCount = ref(0);
  const currentStage = ref(0);
  const factKey = ref(0);
  const finalStatusIndex = ref(0);
  const isInFinalStage = ref(false);

  const securityTips = [
    "🚫 Никогда не вводите данные карты на подозрительных сайтах",
    "🔐 Никогда не сообщайте CVV и PIN-код даже сотрудникам банка",
    "✅ Всегда проверяйте, чтобы сайт начинался с https://",
    "📱 Подключите SMS или push-уведомления о каждой операции",
    "🛡 Подключите двухфакторную аутентификацию в банке",
    "💳 Используйте виртуальные карты для интернет-покупок",
    "🔍 Проверяйте правильность суммы перед подтверждением платежа",
    "📊 Регулярно проверяйте выписки по карте",
    "📉 Установите лимиты на онлайн-платежи для дополнительной защиты",
    "💻 Используйте только официальные приложения и сервисы банка",
    "🧑‍💻 Не вводите данные карты по ссылкам из писем и мессенджеров",
    "🔒 Не сохраняйте данные карты в браузере на чужих устройствах",
    "🧩 Используйте сложные и уникальные пароли для личного кабинета",
    "🛠 Регулярно обновляйте антивирус и систему",
    "🎭 Никогда не фотографируйте карту и не отправляйте фото другим",
    "🏦 Используйте отдельную карту специально для онлайн-платежей",
    "📱 Следите, чтобы номер телефона в банке был актуален",
    "🪪 Храните карту в недоступном для посторонних месте",
    "⏳ Вовремя перевыпускайте карту перед окончанием срока действия",
    "🔔 Настройте уведомления о входе в интернет-банк"
  ];

  const interestingFacts = [
    "CVV-код нельзя вычислить по номеру карты — он генерируется отдельно.",
    "Каждая транзакция с чип-картой формирует уникальный код, что делает подделку крайне сложной.",
    "При онлайн-оплате часто используется токен вместо реальных данных карты.",
    "Технология 3-D Secure добавляет дополнительную проверку при интернет-платежах.",
    "Номер карты состоит из 16 цифр, и первые 6 определяют банк-эмитент.",
    "Первая пластиковая банковская карта появилась в середине XX века.",
    "CVV-код нужен только для интернет-платежей, в магазинах он не используется.",
    "Виртуальные карты создаются мгновенно и не имеют физического носителя.",
    "Магнитная полоса уходит в прошлое — её заменяет более безопасный чип.",
    "Каждая онлайн-операция шифруется протоколом SSL.",
    "Онлайн-платежи проходят через специальные процессинговые шлюзы.",
    "Карта всегда имеет срок действия, после которого выпускается новая.",
    "Карты с чипом могут работать даже при временном отсутствии интернета у терминала.",
    "Бесконтактная оплата работает благодаря технологии NFC.",
    "При оплате по бесконтакту карта не передает полный номер.",
    "PCI DSS — международный стандарт безопасности данных держателей карт.",
    "Уникальность карты подтверждается не только номером, но и сроком + CVV.",
    "При каждой операции банк анализирует её на признаки мошенничества.",
    "Первые пластиковые карты выпускались для удобства оплаты в ресторанах и магазинах.",
    "На обороте карты есть поле для подписи — оно используется для дополнительной проверки."
  ];

  const loadingStages = [
    { threshold: 0, text: "Инициализация..." },
    { threshold: 15, text: "Подготовка формы оплаты..." },
    { threshold: 30, text: "Проверка безопасности..." },
    { threshold: 50, text: "Настройка защищенного соединения..." },
    { threshold: 70, text: "Финальная проверка..." },
    { threshold: 90, text: "Завершение настройки..." },
    { threshold: 99, text: "Подготовка к вводу данных..." }
  ];

  const finalStatuses = [
    "Почти готово...",
    "Еще немного...",
    "Завершаем настройку...",
    "Последние штрихи...",
    "Вот-вот загрузится...",
    "Осталось совсем чуть-чуть...",
    "Финальная подготовка...",
    "Буквально секунда...",
    "Уже почти...",
    "Загружается..."
  ];

  const circumference = computed(() => 2 * Math.PI * 36);
  const strokeDashoffset = computed(() => circumference.value * (1 - progress.value / 100));

  let mainInterval: number | null = null;
  let showTimeout: number | null = null;

  const handleCardClick = () => {
    clickCount.value += 1;
  };

  const completeLoading = () => {
    progress.value = 100;
    loadingText.value = "Готово!";
    isInFinalStage.value = true;
    if (mainInterval) {
      clearInterval(mainInterval);
      mainInterval = null;
    }
  };

  defineExpose({
    completeLoading
  });

  onMounted(() => {
    let lastTipUpdate = Date.now();
    let lastFactUpdate = Date.now();
    let lastFinalUpdate = Date.now();

    mainInterval = window.setInterval(() => {
      const now = Date.now();

      if (!isInFinalStage.value) {
        const newProgress = Math.min(progress.value + 1, 99);

        const newStage = loadingStages.findIndex((stage, index) => {
          const nextStage = loadingStages[index + 1];
          return newProgress >= stage.threshold && (!nextStage || newProgress < nextStage.threshold);
        });

        if (newStage !== currentStage.value && newStage !== -1) {
          currentStage.value = newStage;
          loadingText.value = loadingStages[newStage].text;
        }

        if (newProgress >= 99) {
          isInFinalStage.value = true;
          lastFinalUpdate = now;
        }

        progress.value = newProgress;
      } else {
        if (now - lastFinalUpdate >= 2000) {
          finalStatusIndex.value = (finalStatusIndex.value + 1) % finalStatuses.length;
          loadingText.value = finalStatuses[finalStatusIndex.value];
          lastFinalUpdate = now;
        }
      }

      if (now - lastTipUpdate >= 5000) {
        currentTip.value = (currentTip.value + 1) % securityTips.length;
        lastTipUpdate = now;
      }

      if (now - lastFactUpdate >= 6000) {
        currentFactIndex.value = (currentFactIndex.value + 1) % interestingFacts.length;
        factKey.value = factKey.value + 1;
        lastFactUpdate = now;
      }

    }, 200);

  });

  onUnmounted(() => {
    if (mainInterval) clearInterval(mainInterval);
    if (showTimeout) clearTimeout(showTimeout);
  });
</script>

<template>
  <div class="w-full p-6">
    <div class="mx-auto flex items-center justify-center mb-3">
      <img
        src="../assets/images/methods/mir-logo.svg"
        alt="НСПК Mir"
        class="h-12 md:h-12 lg:h-14 xl:h-16 w-auto" >
    </div>

    <div v-if="clickCount > 0" class="text-center text-sm text-emerald-600 animate-bounce">
      Кликов: {{ clickCount }} <span v-if="clickCount >= 10">🎉</span>
    </div>

    <p class="text-slate-700 text-lg text-center mb-3 mt-1 px-2 font-medium">
      Подготовка защищенной формы для ввода данных банковской карты
    </p>

    <div class="space-y-8 md:space-y-6">
      <div
        class="relative w-20 h-20 md:w-24 md:h-24 lg:w-28
        lg:h-28 xl:w-32 xl:h-32 mx-auto cursor-pointer
        hover:scale-105 transition-transform duration-200"
        @click="handleCardClick"
      >
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="36"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            class="text-slate-200"
          ></circle>
          <circle
            cx="40" cy="40" r="36"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            class="text-emerald-600 transition-all duration-800 ease-out"
            stroke-linecap="round"
          ></circle>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-[24px] md:text-[30px] font-bold text-slate-800">
            {{ progress }}%
          </span>
        </div>
      </div>

      <div class="h-6">
        <p class="text-slate-700 text-base text-center
        md:text-base font-semibold animate-pulse px-2 md:px-0">
          {{ loadingText }}
        </p>
      </div>

      <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-6">
        <div
          class="h-full bg-gradient-to-r from-emerald-500 to-green-500
          rounded-full transition-all duration-800 ease-out"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <div class="bg-emerald-50/80 rounded-xl p-5 border border-emerald-200 mb-4">
      <div class="text-base text-emerald-700 font-semibold mb-3 flex items-center">
        <div class="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"/>
        Безопасность платежей:
      </div>
      <div class="text-sm text-emerald-800">
        {{ securityTips[currentTip] }}
      </div>
    </div>

    <div class="bg-slate-50/80 rounded-xl p-6 md:p-5 lg:p-6 border border-slate-200 mb-4">
      <div class="text-base text-slate-600 font-semibold mb-2 flex items-center">
        <div class="w-2 h-2 bg-slate-500 rounded-full mr-3 animate-pulse"/>
        Интересный факт:
      </div>
      <div :key="factKey" class="text-sm text-slate-700">
        {{ interestingFacts[currentFactIndex] }}
      </div>
    </div>

    <div class="
      flex flex-col sm:flex-row items-center
      justify-center space-y-3 sm:space-y-0 sm:space-x-6
      md:space-x-8 pt-6 md:pt-4"
    >
      <div class="flex items-center space-x-3 text-base md:text-sm text-slate-600 font-medium">
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
        <span>НСПК защита</span>
      </div>
      <div class="flex items-center space-x-3 text-base md:text-sm text-slate-600 font-medium">
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
        <span>SSL 256-bit</span>
      </div>
      <div class="flex items-center space-x-3 text-base md:text-sm text-slate-600 font-medium">
        <div class="w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse" />
        <span>PCI DSS</span>
      </div>
    </div>
  </div>
</template>
