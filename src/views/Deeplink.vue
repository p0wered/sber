<script setup lang="ts">
  import { useRoute, useRouter } from "vue-router";
  import { onMounted, ref } from "vue";
  import { getDisplayName, getLoanData, navigateToApply } from "@/utils/common.ts";
  import { Check, ClockFading } from 'lucide-vue-next';
  import ButtonPrimary from "@/components/Common/Buttons/ButtonPrimary.vue";
  import LoanChanger from '@/components/LoanChanger.vue';

  const route = useRoute();
  const router = useRouter();

  const fullName = ref('');
  const displayName = ref('');
  const phone = ref('');
  const amount = ref(0);
  const period = ref(0);

  onMounted(() => {
    fullName.value = localStorage.getItem('full_name') || '';
    displayName.value = getDisplayName();
    phone.value = localStorage.getItem('phone') || '';

    let loanDataFromSession = getLoanData();

    const querySum = route.query.sum as string;
    const queryLoanLength = route.query.loan_length as string;

    if (querySum) {
      const parsedQuerySum = parseInt(querySum, 10);
      if (!isNaN(parsedQuerySum)) {
        loanDataFromSession.amount = parsedQuerySum;
      }
    }

    if (queryLoanLength) {
      const parsedQueryPeriod = parseInt(queryLoanLength, 10);
      if (!isNaN(parsedQueryPeriod)) {
        loanDataFromSession.period = parsedQueryPeriod;
      }
    }

    sessionStorage.setItem('savedCalculations', JSON.stringify({
      amount: loanDataFromSession.amount,
      period: loanDataFromSession.period
    }));

    amount.value = loanDataFromSession.amount;
    period.value = loanDataFromSession.period;
  });

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('ru-RU');
  };
</script>

<template>
  <div class="md:min-h-[calc(100dvh-110px)]">
    <div
      class="min-h-[calc(100dvh-64px)] md:min-h-auto flex flex-col justify-between px-5 pt-4
      pb-4 md:px-8 md:pt-8 md:pb-5 bg-white border-b-1 border-gray-200 md:border-1
      md:max-w-2xl mx-auto md:my-8 md:rounded-2xl"
      data-aos="fade-in"
    >
      <div class="flex-1 overflow-y-auto md:overflow-visible">
        <h4 v-if="displayName" class="font-bold text-[30px] mb-1">
          {{ displayName }}
        </h4>

        <div class="flex gap-2 mb-4 items-center">
          <p class="font-semibold">
            Ваша заявка одобрена нашим сервисом!
          </p>
          <div class="p-1 rounded-full bg-primary xs:block hidden">
            <Check
              class="w-3 h-3 text-white"
              :stroke-width="3"
            />
          </div>
        </div>

        <p class="mb-4 mr-8">
          Нам уже передали вашу заявку и
          <span class="font-semibold text-primary">
            мы автоматически обработали и согласовали её.
          </span>
        </p>

        <p class="mb-4 mr-8">
          Для завершения оформления Вам осталось только указать паспортные
          данные и реквизиты банковской карты.
        </p>

        <LoanChanger :editable="true"/>
      </div>

      <div class="flex-shrink-0">
        <ButtonPrimary
          label="Завершить оформление"
          @click="() => navigateToApply(router)"
        />

        <div class="flex items-center justify-center gap-2 md:mt-4 mt-3">
          <p class="text-center text-sm md:text-base leading-[100%]">
            Предложение действует:
            <span class="font-bold">
              до {{ getCurrentDate() }}
            </span>
          </p>
          <ClockFading class="hidden 2xs:block w-4 h-4 md:w-5 md:h-5 text-primary"/>
        </div>
      </div>
    </div>
  </div>
</template>
