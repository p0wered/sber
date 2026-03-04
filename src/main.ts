import { createApp } from 'vue';
import { config, loadConfig } from './config';
import { removeQuery, saveParams, syncFullNameFields } from '@/utils/common.ts';
import router from './router/index';
import App from './App.vue';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './assets/main.css';

async function bootstrap() {
    await loadConfig();
    saveParams();
    syncFullNameFields();

    const app = createApp(App);
    app.use(router);
    app.config.globalProperties.$config = config;
    app.mount('#app');
    AOS.init({ offset: 100 });

    await router.isReady();
    const route = router.currentRoute.value;
    const specialRoutes = ['Home', 'Anketa', 'Deeplink'];
    const isInIframe = window.self !== window.top;

    if (specialRoutes.includes(route.name as string) && !isInIframe) {
        await removeQuery(router);
    }
}

bootstrap();
