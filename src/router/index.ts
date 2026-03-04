import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from 'vue-router';
import { config } from '@/config';

const HomeView = () => import('@/views/HomeView.vue');
const Anketa = () => import('@/views/Anketa.vue');
const Companys = () => import('@/views/Companys.vue');
const Offers = () => import('@/views/Offers.vue');
const Unsubscribe = () => import('@/views/Unsubscribe.vue');
const Deeplink = () => import('@/views/Deeplink.vue');
const Documents = () => import('@/views/Documents.vue');
const About = () => import('@/views/About.vue');
const Contacts = () => import('@/views/Contacts.vue');
const Payment = () => import('@/views/Payment.vue');
const PaymentError = () => import('@/views/PaymentError.vue');
const NotFound = () => import('@/views/NotFound.vue');

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,
        meta: { titleKey: '/' }
    },
    {
        path: '/unsubscribe',
        name: 'Unsubscribe',
        component: Unsubscribe,
        meta: { titleKey: '/unsubscribe' }
    },
    {
        path: '/apply',
        name: 'Anketa',
        component: Anketa,
        meta: { titleKey: '/apply' }
    },
    {
        path: '/apply/companys',
        name: 'Companys',
        component: Companys,
        meta: { titleKey: '/apply/companys' }
    },
    {
        path: '/offers',
        name: 'Offers',
        component: Offers,
        meta: { titleKey: '/offers' }
    },
    {
        path: '/apply/deeplink',
        name: 'Deeplink',
        component: Deeplink,
        meta: { titleKey: '/deeplink' }
    },
    {
        path: '/documents',
        name: 'Documents',
        component: Documents,
        meta: { titleKey: '/documents' }
    },
    {
        path: '/about',
        name: 'About',
        component: About,
        meta: { titleKey: '/about' }
    },
    {
        path: '/contacts',
        name: 'Contacts',
        component: Contacts,
        meta: { titleKey: '/contacts' }
    },
    {
        path: '/payment',
        name: 'Payment',
        component: Payment,
        meta: { titleKey: '/payment' }
    },
    {
        path: '/payment-error',
        name: 'PaymentError',
        component: PaymentError,
        meta: { titleKey: '/payment-error' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: { titleKey: '/not-found' }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0, left: 0 };
    }
});

router.beforeEach((to, _from, next) => {
    const titlesMap = config?.titles as Record<string, string> | undefined;
    const key = (to.meta.titleKey as string) ?? to.path;
    document.title = titlesMap?.[key]
        ?? 'Нужен займ?';
    next();
});

export default router;
