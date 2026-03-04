import { nextTick, onUnmounted, ref } from 'vue';
import * as svc from './verificationService';

export function usePhoneVerification(options: { token: string; countdownDuration?: number; codeLength?: number }) {
    const { token, countdownDuration = 20, codeLength = 4 } = options;

    const isLoadingPhone = ref(false);
    const isLoadingCode = ref(false);

    const verificationId = ref<number | null>(null);
    const isCallRequested = ref(false);
    const canCallAgain = ref(false);
    const remainingTime = ref<number>(countdownDuration);
    const countdownInterval = ref<number | null>(null);

    const code = ref<string[]>(Array.from({ length: codeLength }).map(() => ''));
    const codeError = ref<string>('');

    function startCountdown() {
        canCallAgain.value = false;
        remainingTime.value = countdownDuration;

        if (countdownInterval.value) {
            clearInterval(countdownInterval.value);
            countdownInterval.value = null;
        }

        countdownInterval.value = window.setInterval(() => {
            remainingTime.value -= 1;
            if (remainingTime.value <= 0) {
                canCallAgain.value = true;
                if (countdownInterval.value) {
                    clearInterval(countdownInterval.value);
                    countdownInterval.value = null;
                }
            }
        }, 1000);
    }

    async function requestCall(phone: string) {
        isLoadingPhone.value = true;
        try {
            const formattedPhone = phone.replace(/\D/g, '');
            const data = await svc.createVerificationApi(token, formattedPhone);

            isCallRequested.value = true;
            code.value = Array.from({ length: codeLength }).map(() => '');
            codeError.value = '';

            if (data?.success && data?.data?.id) {
                verificationId.value = data.data.id;
                startCountdown();
                await nextTick();
            } else {
                startCountdown();
                throw new Error(data?.message || 'Ошибка создания запроса на звонок');
            }
        } finally {
            isLoadingPhone.value = false;
        }
    }

    async function verify(fullCode: string) {
        if (!verificationId.value) {
            codeError.value = 'Неверный код, попробуйте еще раз';
            return { success: false };
        }
        isLoadingCode.value = true;
        codeError.value = '';
        try {
            const data = await svc.verifyCodeApi(verificationId.value, token, fullCode);
            if (data.success) {
                if (data.data?.status) {
                    return { success: true, data };
                } else {
                    codeError.value = 'Неверный код, попробуйте еще раз';
                    return { success: false, data };
                }
            } else {
                codeError.value = data.message || 'Ошибка проверки кода';
                return { success: false, data };
            }
        } catch (e: any) {
            codeError.value = e?.message || 'Ошибка при проверке кода';
            return { success: false };
        } finally {
            isLoadingCode.value = false;
        }
    }

    function clearTimer() {
        if (countdownInterval.value) {
            clearInterval(countdownInterval.value);
            countdownInterval.value = null;
        }
    }

    onUnmounted(() => {
        clearTimer();
    });

    return {
        isLoadingPhone,
        isLoadingCode,
        verificationId,
        isCallRequested,
        canCallAgain,
        remainingTime,
        code,
        codeError,
        requestCall,
        verify,
        startCountdown,
        clearTimer
    };
}
