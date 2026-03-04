import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { config } from '@/config.ts';
import type { Router } from "vue-router";

/** Возвращает значение куки по имени или null, если нет **/
export function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Устанавливает cookie с именем name и значением value.
 * @param name
 * @param value
 * @param days срок жизни в днях (по умолчанию 30)
 */
export const setCookie = (name: string, value: string, days = 30) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
};

/** Стирает utm_source из query параметров **/
export const removeUtmFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('utm_source')) {
        urlParams.delete('utm_source');

        const newSearch = urlParams.toString();
        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');

        window.history.replaceState({}, '', newUrl);
    }
};

/** Переход к анкете с открытием double витрины **/
export const navigateToApply = (router: Router ) => {
    const currentQueryParams = new URLSearchParams(window.location.search).toString();
    const newTabUrl = `/apply${currentQueryParams ? '?' + currentQueryParams : ''}`;

    window.open(newTabUrl, '_blank');

    router.push({
        path: '/apply/companys',
        query: {
            type: 'double'
        }
    });
};

/**
 * Определяет, прошло ли 30 минут с момента успешной привязки карты
 */
export const isConversionSuccess = (): boolean => {
    const conversionSuccess = localStorage.getItem("conversionSuccess");

    if (!conversionSuccess) {
        return false;
    }

    const conversionTimestamp = parseInt(conversionSuccess, 10);
    const currentTime = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 минут

    return (currentTime - conversionTimestamp) > thirtyMinutes;
};

/**
 * Определяет, находится ли сайт внутри iframe
 */
export function useIsInIframe() {
    const isInIframe = computed(() => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    });

    return { isInIframe };
}

/**
 * Определяет, есть ли utm_source в query параметрах или cookie и записывает
 * результат в переменную hasUtmSource. Также, если непустой utm_source есть
 * в query параметрах, то он записывается в cookie.
 */
export function useUtmSource() {
    const route = useRoute();

    const isInIframe = (() => {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    })();

    const hasUtmSource = computed(() => {
        if (isInIframe) {
            return true;
        }

        if (isConversionSuccess()) {
            removeUtmFromUrl();
            document.cookie = `${encodeURIComponent('utm_source')}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
            localStorage.removeItem('conversionSuccess');
            return false;
        }

        const utmQuery = route.query.utm_source;
        if (utmQuery && String(utmQuery).trim() !== '') {
            return true;
        }
        const utmCookie = getCookie('utm_source');
        return !!utmCookie && utmCookie.trim() !== '';
    });

    const writeUtmToCookie = (utmValue: unknown) => {
        const str = String(utmValue || '').trim();
        if (str !== '') {
            setCookie('utm_source', str, 3);
        }
    };

    onBeforeMount(() => {
        if (!isConversionSuccess()) {
            writeUtmToCookie(route.query.utm_source);
        }
    });

    watch(
        () => route.query.utm_source,
        (newVal, oldVal) => {
            if (newVal !== oldVal && !isConversionSuccess()) {
                writeUtmToCookie(newVal);
            }
        }
    );
    return { hasUtmSource };
}

/**
 * Логика открытия витрины типа overloaded по таймеру
 * @param timeoutMs длительность таймера в миллисекундах
 */
export function useInactivityTimer(timeoutMs = 15 * 60 * 1000) {
    const router = useRouter();
    const route = useRoute();
    const inactivityTimer = ref<ReturnType<typeof setTimeout> | null>(null);
    const excludedRoutes = ['/apply/companys', '/offers'];

    function startTimer() {
        inactivityTimer.value = setTimeout(() => {
            router.push('/apply/companys?type=overloaded');
        }, timeoutMs);
    }

    function handleActivity() {
        if (inactivityTimer.value !== null) {
            clearTimeout(inactivityTimer.value);
        }
        startTimer();
    }

    function resetTimer() {
        if (excludedRoutes.includes(route.path)) return;
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        startTimer();
    }

    function stopTimer() {
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keypress', handleActivity);
        if (inactivityTimer.value !== null) {
            clearTimeout(inactivityTimer.value);
        }
    }

    onMounted(resetTimer);
    onUnmounted(stopTimer);
}

/**
 * Форматирует номер телефона в вид "+7 (XXX) XXX-XX-XX".
 * Удаляет все нецифровые символы и применяет маску.
 * @param rawPhone Необработанный номер телефона (например, "79031234567").
 * @returns Отформатированный номер или пустая строка, если номер некорректен.
 */
function formatPhoneNumber(rawPhone: string): string {
    const cleaned = rawPhone.replace(/\D/g, '');
    if (!cleaned.startsWith('7') && !cleaned.startsWith('8') || cleaned.length !== 11) {
        return '';
    }
    const finalPhone = cleaned.startsWith('8') ? '7' + cleaned.substring(1) : cleaned;

    return `+7 (${finalPhone.substring(1, 4)}) `
        + `${finalPhone.substring(4, 7)}-`
        + `${finalPhone.substring(7, 9)}-`
        + `${finalPhone.substring(9, 11)}`;
}

/** Записывает указанные query параметры в cookie и localStorage **/
export const saveParams = (cookieDays: number = 30) => {
    const params = new URLSearchParams(window.location.search);

    const cookieKeys = [
        'sub1', 'sub2', 'sub3', 'sub4', 'sub5', 'sub6', 'sub7',
        'click_id', 'tr_click_id'
    ];

    const localStorageKeys = [
        'email',
        'birthday'
    ];

    const containsBrackets = (str: string): boolean => {
        return /[\(\)\{\}\[\]]/.test(str);
    };

    // запись всех куки из списка выше
    cookieKeys.forEach(key => {
        const val = params.get(key);
        if (val && val.trim() !== '' && !containsBrackets(val)) {
            setCookie(key, val, cookieDays);
        }
    });

    // запись всех localStorage значений из списка выше
    localStorageKeys.forEach(key => {
        const val = params.get(key);
        if (val && val.trim() !== '' && !containsBrackets(val)) {
            localStorage.setItem(key, val);
        }
    });

    // запись фио в отдельные поля localStorage
    const fn = (params.get('first_name') || params.get('name') || '').trim();
    const ln = (params.get('last_name') || params.get('surname') || '').trim();
    const pt = (params.get('patronymic') || params.get('middle_name') || '').trim();

    if (fn && !containsBrackets(fn)) {
        localStorage.setItem('first_name', fn);
    }
    if (ln && !containsBrackets(ln)) {
        localStorage.setItem('last_name', ln);
    }
    if (pt && !containsBrackets(pt)) {
        localStorage.setItem('patronymic', pt);
    }

    // запись фио полностью в localStorage
    const nameParts = [ln, fn, pt].filter(part => part && !containsBrackets(part));
    if (nameParts.length > 0) {
        localStorage.setItem('full_name', nameParts.join(' '));
    }

    // запись телефона в формате 7 (900) 900-90-90 в localStorage
    const rawPhone = params.get('phone');
    if (rawPhone && rawPhone.trim() !== '' && !containsBrackets(rawPhone)) {
        const formattedPhone = formatPhoneNumber(rawPhone);
        if (formattedPhone) {
            localStorage.setItem('phone', formattedPhone);
        }
    }

    // перебор всех вариантов web_id и запись в куки
    const webIdSources = ['web_id', 'wm_id', 'plid', 'campaign'];
    let foundWebIdValue: string | null = null;

    for (const sourceKey of webIdSources) {
        const val = params.get(sourceKey);
        if (val && val.trim() !== '') {
            foundWebIdValue = val;
            break;
        }
    }

    if (foundWebIdValue) {
        setCookie('web_id', foundWebIdValue, cookieDays);
    }

    // запись sid в куки
    if (config.siteId) {
        setCookie('site_id', config.siteId.toString());
    }

    // запись sum и loan_length в sessionStorage
    const sum = params.get('sum');
    const loanLength = params.get('loan_length');

    if (sum || loanLength) {
        const existingData = sessionStorage.getItem('savedCalculations');
        let calculationsData: any = {};

        if (existingData) {
            try {
                calculationsData = JSON.parse(existingData);
            } catch (e) {
                calculationsData = {};
            }
        }

        if (sum) {
            const parsedSum = parseInt(sum, 10);
            if (!isNaN(parsedSum)) {
                calculationsData.amount = parsedSum;
            }
        }

        if (loanLength) {
            const parsedLength = parseInt(loanLength, 10);
            if (!isNaN(parsedLength)) {
                calculationsData.period = parsedLength;
            }
        }

        sessionStorage.setItem('savedCalculations', JSON.stringify(calculationsData));
    }
};

/**
 * Получает части ФИО из отдельных полей или full_name.
 * Сначала проверяет отдельные поля в localStorage, потом full_name.
 * Возвращает объект с lastName, firstName, patronymic.
 */
export function getFullNameParts(): { lastName: string; firstName: string; patronymic: string } {
    const firstName = localStorage.getItem('first_name') || '';
    const lastName = localStorage.getItem('last_name') || '';
    const patronymic = localStorage.getItem('patronymic') || '';

    if (firstName || lastName || patronymic) {
        return { lastName, firstName, patronymic };
    }

    const fullName = localStorage.getItem('full_name') || '';
    if (!fullName) {
        return { lastName: '', firstName: '', patronymic: '' };
    }

    const parts = fullName.trim().split(/\s+/);
    return {
        lastName: parts[0],
        firstName: parts[1],
        patronymic: parts.slice(2).join(' ')
    };
}

/** Форматирует ФИО для отображения пользователю **/
export function getDisplayName(): string {
    const { lastName, firstName } = getFullNameParts();

    if (lastName && firstName) {
        return `${lastName} ${firstName}`;
    }

    if (firstName) {
        return firstName;
    }

    return '';
}

/**
 * Синхронизирует full_name и отдельные поля ФИО в localStorage.
 * - Если есть отдельные поля, формирует из них full_name
 * - Если есть full_name из 3 слов и нет отдельных полей, разбивает на части
 */
export function syncFullNameFields(): void {
    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
    const patronymic = localStorage.getItem('patronymic');
    const fullName = localStorage.getItem('full_name');

    if (firstName || lastName || patronymic) {
        const parts = [lastName, firstName, patronymic].filter(Boolean);
        if (parts.length > 0) {
            localStorage.setItem('full_name', parts.join(' '));
        }
        return;
    }

    if (fullName) {
        const parts = fullName.trim().split(/\s+/).filter(Boolean);

        if (parts.length === 3) {
            localStorage.setItem('last_name', parts[0]);
            localStorage.setItem('first_name', parts[1]);
            localStorage.setItem('patronymic', parts[2]);
        }
    }
}

/** Удаляет query параметры из url **/
export const removeQuery = async (router: any) => {
    const cur = router.currentRoute.value;

    try {
        if (cur.name) {
            await router.replace({
                name: cur.name as any,
                params: cur.params as any,
                query: {},
                hash: cur.hash || ''
            });
        } else {
            const base = cur.fullPath.split('?')[0] + (cur.hash || '');
            await router.replace(base);
        }
    } catch (e) {
    }
};

/** Возвращает значения слайдеров из sessionStorage **/
export const getLoanData = () => {
    const savedCalculations = sessionStorage.getItem('savedCalculations');

    if (!savedCalculations) return { amount: 25000, period: 10 };

    try {
        const parsedData = JSON.parse(savedCalculations);
        return {
            amount: typeof parsedData?.amount === 'number' ? parsedData.amount : 25000,
            period: typeof parsedData?.period === 'number' ? parsedData.period : 10
        };
    } catch (error) {
        console.error('Ошибка получения savedCalculations:', error);
        return { amount: 25000, period: 10 };
    }
};

/** Логика редиректа на comebacker витрину при попытках вернуться назад */
export const useComebacker = () => {
  const router = useRouter();

  function isChromiumBased() {
    const ua = navigator.userAgent;
    return /Chrome|Chromium|Edg|OPR|Brave|Vivaldi|YaBrowser|SamsungBrowser|UCBrowser/.test(ua);
  }

  history.pushState(null, "", "");

  window.addEventListener("popstate", function () {
    if (isChromiumBased()) {
      // для chromium браузеров работает только так
      document.location.href = '/apply/companys?type=comebacker';
    } else {
      router.push({ path: '/apply/companys', query: { type: 'comebacker' } });
    }
  });
};
