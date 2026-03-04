import { reactive } from 'vue';
import { setCookie } from '@/utils/common.ts';
import type { ConfigData } from '@/global-types';
import localConfig from '@/config.local.json';

const configData = reactive<Record<string, any>>({});
let loaded = false;
let loading: Promise<void> | null = null;

export function getTid(): string | null {
  const cookieMatch = document.cookie.match(/(?:^|; )tid=([^;]+)/);
  if (cookieMatch) {
    try {
      return decodeURIComponent(cookieMatch[1]);
    } catch (e) {
      console.warn('Не удалось декодировать tid из куки:', e);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const urlTid = params.get('tid');

  if (urlTid) {
    setCookie('tid', urlTid);
    return urlTid;
  }

  return null;
}

export function loadConfig(): Promise<void> {
  if (loaded) return Promise.resolve();

  if (import.meta.env.DEV) {
    Object.assign(configData, localConfig);
    loaded = true;
    return Promise.resolve();
  }

  if (!loading) {
    const tid = getTid();
    const url = new URL('/api/legal-data', window.location.origin);
    if (tid) url.searchParams.set('tid', tid);

    loading = fetch(url.toString())
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        Object.assign(configData, json);
        loaded = true;
      })
      .catch(err => console.error('Ошибка загрузки config:', err));
  }

  return loading!;
}

export const config = new Proxy(reactive(configData), {
  get(target, key: string) {
    if (!loaded) console.warn(`⚠️ Config для "${key}" ещё не загружен!`);

    const domain = window.location.origin;
    const domainConfig = Reflect.get(target, domain) ?? {};

    return Reflect.get(domainConfig, key);
  }
}) as unknown as ConfigData;
