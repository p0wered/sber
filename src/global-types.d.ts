export interface BotLinks {
  bot_support_link: string;
  vk_link: string;
  bot_link: string;
}

export interface DocumentConfig {
  slug: string;
  pdf_path: string;
  v_date: string;
}

export interface ConfigData {
  type: string;
  domain: string;
  inn: string;
  kpp: string;
  sum: string;
  name: string;
  order: string;
  address: string;
  rknNumber: string;
  legalEntity: string;
  phoneNumber: string;
  source_data: string[];
  acc_data_date: string;
  generalEntity: string;
  offer_app_date: string;
  sub_agree_date: string;
  pd_consent_date: string;
  recur_agree_date: string;
  politics_obrab_date: string;
  individualEntrepreneurNumber: string;
  email: string;
  siteName: string;
  headText: string;
  headSubText: string;
  signature_entity: string;
  seal_entity: string;
  siteId: number;
  cid: number;
  titles: Record<string, string>;
  documents: DocumentConfig[];
  bots: BotLinks;
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $config: ConfigData
    }
}
