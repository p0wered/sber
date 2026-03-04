<script setup lang="ts">
  import { ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import {
    useInactivityTimer,
    useIsInIframe,
    useUtmSource
  } from "@/utils/common.ts";
  import Footer from "@/components/Footer.vue";
  import Header from "@/components/Header.vue";
  import PageLoading from "@/components/PageLoading.vue";
  import SubscriptionPopup from "@/components/SubscriptionPopup.vue";

  const route = useRoute();
  const router = useRouter();
  const { hasUtmSource } = useUtmSource();
  const { isInIframe } = useIsInIframe();

  const isLoading = ref(false);
  const isPopupOpen = ref(true);

  const popupRoutes = [
    'Home',
    'Anketa',
    'Deeplink',
    'Documents',
    'About'
  ];

  const noHeaderRoutes = [
    'Offers',
    'PaymentError'
  ];

  const noFooterRoutes = [
    'Deeplink',
    'Offers',
    'PaymentError'
  ];

  router.beforeEach(() => {
    isLoading.value = true;
  });

  router.afterEach((to) => {
    isLoading.value = false;
    isPopupOpen.value = popupRoutes.includes(to.name as string) && !hasUtmSource.value;
  });

  useInactivityTimer();
</script>

<template>
  <template v-if="isLoading">
    <PageLoading/>
  </template>

  <template v-else>
    <Header
      v-if="!noHeaderRoutes.includes(route.name as string)"
      :on-home-page="route.name === 'Home'"
    />
    <RouterView/>
    <SubscriptionPopup
      v-if="isPopupOpen"
      @close="isPopupOpen = false"
    />
    <Footer
      v-if="!isInIframe && !noFooterRoutes.includes(route.name as string)"
    />
  </template>
</template>
