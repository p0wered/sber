export type CreateVerificationResponse = {
    success: boolean;
    data?: { id: number };
    message?: string;
};

export type VerifyCodeResponse = {
    success: boolean;
    data?: { status: boolean };
    message?: string;
};

const BASE = 'https://api.finance.ingroup.tech/api';

export async function createVerificationApi(token: string, phone: string): Promise<CreateVerificationResponse> {
    const res = await fetch(`${BASE}/phone-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, phone })
    });

    if (!res.ok) {
        return { success: false, message: `HTTP ${res.status}` };
    }
    return res.json();
}

export async function verifyCodeApi(verificationId: number, token: string, code: string): Promise<VerifyCodeResponse> {
    const res = await fetch(`${BASE}/phone-verification?id=${verificationId}&token=${token}&code=${code}`, {
        method: 'GET'
    });

    if (!res.ok) {
        return { success: false, message: `HTTP ${res.status}` };
    }
    return res.json();
}
