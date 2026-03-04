<script setup lang="ts">
  import { onMounted } from 'vue';
  import LoadingSpinner from "@/components/LoadingSpinner.vue";

  onMounted(() => {
    const leadId = localStorage.getItem('lead_id');

    if (leadId) {
      sessionStorage.setItem('payment_retry_redirect', 'true');
    }

    const targetUrl = `${window.location.origin}/apply`;

    if (window.top && window.top !== window.self) {
      window.top.location.href = targetUrl;
    } else {
      window.location.href = targetUrl;
    }
  });
</script>

<template>
  <!-- это страница, на которую редиректит терминал при неудачной попытке оплаты -->
  <div class="flex flex-col gap-3 items-center justify-center min-h-screen">
    <LoadingSpinner class="text-gray-500/65" size="36px"/>
    <p class="text-gray-500/80">
      Перенаправление...
    </p>
  </div>
</template>
