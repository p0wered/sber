const CALC_KEY = 'savedCalculations';

export interface CalculationData {
    amount: number;
    period: number;
    isWeeklyPeriod: boolean;
}

export function createDefaultCalculations(): CalculationData {
    const saved = sessionStorage.getItem(CALC_KEY);

    if (saved) {
        const parsed = JSON.parse(saved);
        return {
            amount: typeof parsed.amount === 'number' ? parsed.amount : 25000,
            period: typeof parsed.period === 'number' ? parsed.period : 10,
            isWeeklyPeriod: typeof parsed.isWeeklyPeriod === 'boolean' ? parsed.isWeeklyPeriod : false
        };
    } else {
        return {
            amount: 25000,
            period: 10,
            isWeeklyPeriod: false
        };
    }
}

export function saveCalculations(
    amount: number,
    period: number,
    isWeeklyPeriod: boolean
) {
    sessionStorage.setItem(
        CALC_KEY,
        JSON.stringify({
            amount,
            period,
            isWeeklyPeriod
        })
    );
}
