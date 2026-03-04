<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useComebacker } from "@/utils/common.ts";
  import DisplayMain from '@/components/Companys/Main/Body.vue';
  import DisplayAlt1 from '@/components/Companys/Alt1/Body.vue';
  import DisplayAlt2 from '@/components/Companys/Alt2/Body.vue';
  import DisplayAlt3 from '@/components/Companys/Alt3/Body.vue';

  const route = useRoute();
  const currentDesign = ref<'main' | 'alt1' | 'alt2' | 'alt3' | null>(null);

  const getNextDesignIndex = (maxIndex: number): number => {
    const storageKey = 'comebackerDesign';
    const currentIndex = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
    const nextIndex = (currentIndex + 1) % maxIndex;
    sessionStorage.setItem(storageKey, nextIndex.toString());
    return nextIndex;
  };

  const selectDesign = (): void => {
    if (route.query.type !== 'comebacker') {
      currentDesign.value = 'alt3';
      return;
    }

    const designIndex = getNextDesignIndex(3);
    switch (designIndex) {
      case 0:
        currentDesign.value = 'alt3';
        break;
      case 1:
        currentDesign.value = 'alt1';
        break;
      case 2:
        currentDesign.value = 'alt2';
        break;
      default:
        currentDesign.value = 'alt3';
    }
  };

  onBeforeMount(selectDesign);

  onMounted(() => {
    if (route.query.type === 'comebacker') {
      useComebacker();
    }
  });
</script>

<template>
  <DisplayMain v-if="currentDesign === 'main'"/>
  <DisplayAlt1 v-else-if="currentDesign === 'alt1'"/>
  <DisplayAlt2 v-else-if="currentDesign === 'alt2'"/>
  <DisplayAlt3 v-else-if="currentDesign === 'alt3'"/>
</template>
