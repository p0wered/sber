import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getCookie, getDisplayName } from '@/utils/common.ts';
import { config } from '@/config';
import TgBotImage from '@/assets/images/companys/tg-bot.svg';
import VkBotImage from '@/assets/images/companys/vk-bot.svg';

export interface Offer {
  id: string
  logo: string
  name: string
  max_loan: string
  offer_type: string
  partner_id: string
  percentage: string
  variant_id: string
  loan_length_max: string
  loan_length_min: string
  approved_age_max: string
  approved_age_min: string
  link: string
}

interface ApiResponse {
  offers: Offer[]
  checkers: number[]
  user: { status: string }
  tracking_active: string | null
}

export interface UseCompanysOptions {
  vid?: number;
}

export function useCompanys(options: UseCompanysOptions = {}) {
  const route = useRoute();
  const loading = ref(true);
  const error = ref('');
  const offers = ref<Offer[]>([]);
  const clickedOffers = ref(new Set<string>());
  const displayName = ref<string>('');
  type offersType = keyof typeof offersId;

  const offersId = {
    default: 16,
    double: 17,
    comebacker: 18,
    overloaded: 19
  } as const;

  const sortedOffers = computed(() => {
    const notClicked = offers.value.filter(offer => !clickedOffers.value.has(offer.id));
    const clicked = offers.value.filter(offer => clickedOffers.value.has(offer.id));
    return [...notClicked, ...clicked];
  });

  const displayItems = computed(() => {
    return sortedOffers.value.map(offer => ({ type: 'offer', ...offer }));
  });

  const getOffersId = (type: string | null): number => {
    return offersId[type as offersType] ?? offersId.default;
  };

  const getAdditionalUtms = (): string => {
    const utmSource = getCookie('utm_source') || '';
    const utmWeb = route.query.utm_web || '';

    return JSON.stringify({
      utm_source: utmSource,
      utm_web: utmWeb
    });
  };

  const fetchStaticOffers = async (): Promise<Offer[]> => {
    const response = await axios.get<ApiResponse>(`/api/static-vitrina/${offersId.default}`);
    return response.data?.offers ?? [];
  };

  const fetchPrimaryOffers = async (
    vid: number,
    additionalUtms: string,
    uid: string
  ): Promise<Offer[]> => {
    const formData = new FormData();
    formData.append('vid', String(vid));
    formData.append('additional_utms', additionalUtms);
    formData.append('uid', uid);

    const response = await axios.post<ApiResponse>('https://api.mfo-0.ru/offers?v=2.0', formData);
    return response.data?.offers ?? [];
  };

  const fetchOffers = async () => {
    loading.value = true;
    error.value = '';

    const uid = (route.query.uid as string) || getCookie('lead_id') || '';
    const vid = options.vid ?? getOffersId(route.query.type as string);
    const additionalUtms = getAdditionalUtms();

    const processOffers = (offersList: Offer[]) => {
      if (offersList.length) {
        const botOffers: Offer[] = [
          {
            id: 'tg-bot',
            logo: TgBotImage,
            name: 'Займ через Телеграм',
            max_loan: '100000',
            offer_type: 'bot',
            partner_id: 'bot',
            percentage: '0',
            variant_id: 'bot',
            loan_length_max: '365',
            loan_length_min: '5',
            approved_age_max: '80',
            approved_age_min: '18',
            link: config.bots?.bot_link || 'https://t.me/zaym_help_bot'
          },
          {
            id: 'vk-bot',
            logo: VkBotImage,
            name: 'Займ через Вконтакте',
            max_loan: '100000',
            offer_type: 'bot',
            partner_id: 'bot',
            percentage: '0',
            variant_id: 'bot',
            loan_length_max: '365',
            loan_length_min: '5',
            approved_age_max: '80',
            approved_age_min: '18',
            link: config.bots?.vk_link || 'https://vk.me/finsos'
          }
        ];

        offers.value = [...offersList, ...botOffers];
        return;
      } else {
        throw Error;
      }
    };

    try {
      const offersPrimary = await fetchPrimaryOffers(vid, additionalUtms, uid);
      processOffers(offersPrimary);
    } catch (err) {
      console.error('Ошибка при загрузке предложений:', err);

      try {
        const fallbackOffers = await fetchStaticOffers();
        processOffers(fallbackOffers);
      } catch (fallbackErr) {
        error.value = 'Не удалось загрузить предложения. Попробуйте позже.';
      }
    } finally {
      loading.value = false;
    }
  };

  const handleOfferClick = (offerId: string): void => {
    clickedOffers.value.add(offerId);
    const clicked = Array.from(clickedOffers.value);
    localStorage.setItem('clickedOffers', JSON.stringify(clicked));
  };

  const loadClickedOffers = (): void => {
    try {
      const saved = localStorage.getItem('clickedOffers');
      if (saved) {
        const parsed = JSON.parse(saved);
        clickedOffers.value = new Set(parsed);
      }
    } catch (err) {
      console.error('Ошибка при загрузке просмотренных предложений:', err);
    }
  };

  const sendPostback = async (): Promise<void> => {
    try {
      const uid = route.query.uid as string || getCookie('lead_id') || '';

      const formData = new FormData();
      formData.append('lead_id', uid);
      formData.append('status', 'addCard');
      formData.append('key', 'BVmP2UpftWzUWmCTMXY9CMGkGq8n7cNCDvHDXahj9BzjDRZfFpKFghbAGQF5');

      await axios.post(`https://api.mfo-0.ru/set-verify?site_id=${config.siteId}`, formData);
    } catch (err) {
      console.error('Ошибка при отправке постбэка:', err);
    }
  };

  const removeFromIframeParam = (): void => {
    if ('from_iframe' in route.query) {
      const url = new URL(window.location.href);
      url.searchParams.delete('from_iframe');
      window.top!.location.href = url.toString();
    }
  };

  onMounted(async () => {
    displayName.value = getDisplayName();

    loadClickedOffers();
    removeFromIframeParam();

    if (route.query.activation === '1') {

      if (!localStorage.getItem("conversionSuccess")) {
        localStorage.setItem('conversionSuccess', Date.now().toString());
      }

      await sendPostback();
    }

    await fetchOffers();
  });

  return {
    loading,
    error,
    displayItems,
    clickedOffers,
    displayName,
    handleOfferClick
  };
}
