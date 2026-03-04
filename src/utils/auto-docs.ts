import { computed } from 'vue';
import { config } from "@/config.ts";

interface DocumentItem {
    slug: string
    pdf_path: string
    v_date?: string
}

interface DocumentMap {
    [key: string]: DocumentItem | null
}

/** Получение переменных с автодоками **/
export function useAutoDocs() {
    const documents: DocumentItem[] = config?.documents || [];

    const documentMap = computed<DocumentMap>(() => {
        return documents.reduce((acc, doc) => {
            acc[doc.slug] = doc;
            return acc;
        }, {} as DocumentMap);
    });

    const addVersionParam = (doc: DocumentItem | null): string | null => {
        if (!doc) return null;

        const { pdf_path: url, v_date } = doc;

        if (!v_date) {
            return url;
        } else {
            const separator = url.includes('?') ? '&' : '?';
            return `${url}${separator}v=${v_date}`;
        }
    };

    const publicOfertaPdf = computed(() => addVersionParam(documentMap.value.offerta));
    const personalDataPoliticPdf = computed(() => addVersionParam(documentMap.value.politics_obrab));
    const personalDataAgreementPdf = computed(() => addVersionParam(documentMap.value.sogl_obrab));
    const paidSubAgreementPdf = computed(() => addVersionParam(documentMap.value.sogl_podpiska));
    const recurrPaymentsAgreementPdf = computed(() => addVersionParam(documentMap.value.recurr_payments_agreement));
    const cardDataAgreementPdf = computed(() => addVersionParam(documentMap.value.card_data_agreement));

    return {
        publicOfertaPdf,
        personalDataPoliticPdf,
        personalDataAgreementPdf,
        paidSubAgreementPdf,
        recurrPaymentsAgreementPdf,
        cardDataAgreementPdf
    };
}
