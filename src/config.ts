import { reactive } from 'vue';
import { setCookie } from '@/utils/common.ts';
import type { ConfigData } from '@/global-types';
import localConfig from '@/config.local.json';

const configData = reactive<Record<string, any>>({});
let loaded = false;

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

  Object.assign(configData, localConfig);
  loaded = true;
  return Promise.resolve();
}

export const config = new Proxy(reactive(configData), {
  get(target, key: string) {
    if (!loaded) console.warn(`⚠️ Config для "${key}" ещё не загружен!`);

    const domain = window.location.origin;
    const domainConfig = Reflect.get(target, domain) ?? {};

    return Reflect.get(domainConfig, key);
  }
}) as unknown as ConfigData;
