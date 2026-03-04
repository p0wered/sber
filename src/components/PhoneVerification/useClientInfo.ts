import { computed, onMounted, ref } from 'vue';

export function useClientInfo() {
    const ip = ref<string>('--');
    const device = ref<string>('--');

    function getDeviceInfo(): string {
        const uaData = (navigator as any).userAgentData;

        if (uaData) {
            const realBrands = uaData.brands?.filter((brand: any) =>
                !brand.brand.includes('Not') &&
                !brand.brand.includes('Brand') &&
                brand.brand !== 'Chromium'
            );

            let browserInfo = 'Unknown Browser';
            if (realBrands && realBrands.length > 0) {
                browserInfo = realBrands[0].brand;
                if (realBrands[0].version) {
                    browserInfo += ` ${realBrands[0].version}`;
                }
            }

            const deviceType = uaData.mobile ? 'Mobile' : 'Desktop';
            const platform = uaData.platform || navigator.platform || '';

            return `${browserInfo} (${platform}) - ${deviceType}`;
        }

        const ua = navigator.userAgent || '';
        const platform = navigator.platform || '';

        let browser = 'Unknown Browser';
        if (/Edg\//.test(ua)) {
            const version = ua.match(/Edg\/([\d.]+)/)?.[1];
            browser = `Microsoft Edge ${version || ''}`;
        } else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
            const version = ua.match(/Chrome\/([\d.]+)/)?.[1];
            browser = `Google Chrome ${version || ''}`;
        } else if (/Firefox\//.test(ua)) {
            const version = ua.match(/Firefox\/([\d.]+)/)?.[1];
            browser = `Mozilla Firefox ${version || ''}`;
        } else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) {
            const version = ua.match(/Version\/([\d.]+)/)?.[1];
            browser = `Safari ${version || ''}`;
        }

        let deviceInfo = '';
        if (/iPhone/.test(ua)) {
            deviceInfo = 'iPhone';
        } else if (/iPad/.test(ua)) {
            deviceInfo = 'iPad';
        } else if (/Android/.test(ua)) {
            const androidMatch = ua.match(/Android\s*([\d.]+)/);
            deviceInfo = androidMatch ? `Android ${androidMatch[1]}` : 'Android';
        } else if (/Windows/.test(ua)) {
            deviceInfo = 'Windows';
        } else if (/Macintosh/.test(ua)) {
            deviceInfo = 'macOS';
        } else {
            deviceInfo = platform;
        }

        const isMobile = /Mobile|Android|iPhone|iPad/.test(ua);
        const deviceType = isMobile ? 'Mobile' : 'Desktop';

        return `${browser} (${deviceInfo}) - ${deviceType}`;
    }

    async function fetchClientIp() {
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            if (!res.ok) return;
            const data = await res.json();
            if (data?.ip) ip.value = data.ip;
        } catch (e) {
            console.warn('Не удалось получить IP:', e);
        }
    }

    const logData = computed(() => {
        const now = new Date();
        return {
            ip: ip.value,
            device: device.value,
            timestamp: now.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };
    });

    onMounted(() => {
        device.value = getDeviceInfo();
        void fetchClientIp();
    });

    return {
        ip,
        device,
        logData
    };
}
