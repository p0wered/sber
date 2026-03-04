<script setup lang="ts">
  import CalculatorSection from '@/components/Home/CalculatorSection.vue';
  import HowToSection from "@/components/Home/HowToSection.vue";
  import StatsSection from "@/components/Home/StatsSection.vue";
  import FaqSection from "@/components/Home/FaqSection.vue";
  import OptionsSection from "@/components/Home/OptionsSection.vue";
</script>

<template>
  <div class="flex flex-col bg-secondary">
    <CalculatorSection/>
    <HowToSection/>
    <OptionsSection/>
    <StatsSection/>
    <FaqSection/>
  </div>
</template>
