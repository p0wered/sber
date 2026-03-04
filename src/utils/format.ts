import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export function pluralize(count: number, wordsCollection: any) {
    let formattedWord = wordsCollection['many'];

    const exclusions = [11, 12, 13, 14];
    const few = [2, 3, 4];

    if (exclusions.includes(count % 100)) {
        formattedWord = wordsCollection['many'];
    } else if (few.includes(count % 10)) {
        formattedWord = wordsCollection['few'];
    } else if (count % 10 === 1) {
        formattedWord = wordsCollection['one'];
    }

    return `${count} ${formattedWord}`;
}

export function pluralizeDays(daysAmount: number) {
    return pluralize(daysAmount, {
        one: 'день',
        few: 'дня',
        many: 'дней'
    });
}

export function pluralizeWeeks(weeksAmount: number) {
    return pluralize(weeksAmount, {
        one: 'неделя',
        few: 'недели',
        many: 'недель'
    });
}

export function pluralizeMonths(monthsAmount: number) {
    return pluralize(monthsAmount, {
        one: 'месяц',
        few: 'месяца',
        many: 'месяцев'
    });
}

export function pluralizeYears(yearsAmount: number) {
    return pluralize(yearsAmount, {
        one: 'год',
        few: 'года',
        many: 'лет'
    });
}

interface PeriodMap {
    unit: 'day' | 'month' | 'year';
    value: number;
}

export function mapSliderValueToPeriod(sliderValue: number): PeriodMap {
    if (sliderValue <= 29) {
        return { unit: 'day', value: sliderValue };
    } else if (sliderValue >= 30 && sliderValue <= 41) {
        return { unit: 'month', value: sliderValue - 29 };
    } else {
        return { unit: 'year', value: 1 };
    }
}

export function formatLoanPeriod(sliderValue: number): string {
    const { unit, value } = mapSliderValueToPeriod(sliderValue);

    switch (unit) {
        case 'day':
            return pluralizeDays(value);
        case 'month':
            return pluralizeMonths(value);
        case 'year':
            return pluralizeYears(value);
        default:
            return '';
    }
}

export function formatCurrency(amount: number) {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
    });

    return formatter.format(amount);
}

export function formatNumber(amount: number) {
    const formatter = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0
    });

    return formatter.format(amount);
}

export function formatDate(date: Date, dateFormat: string) {
    return format(date, dateFormat, { locale: ru });
}

export function sliderIndexToDays(index: number): number {
    const { unit, value } = mapSliderValueToPeriod(index);
    switch (unit) {
        case 'day':   return value;
        case 'month': return value * 30;
        case 'year':  return value * 365;
    }
}

/**
 * Форматирует дату в относительный формат ("5 минут назад", "вчера" и т.д.)
 */
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
        return 'только что';
    } else if (diffMin < 60) {
        return `${pluralize(diffMin, { one: 'минуту', few: 'минуты', many: 'минут' })}`;
    } else if (diffHour < 24) {
        return `${pluralize(diffHour, { one: 'час', few: 'часа', many: 'часов' })} назад`;
    } else if (diffDay === 1) {
        return 'вчера';
    } else if (diffDay < 7) {
        return `${pluralize(diffDay, { one: 'день', few: 'дня', many: 'дней' })} назад`;
    } else if (diffWeek < 4) {
        return `${pluralize(diffWeek, { one: 'неделю', few: 'недели', many: 'недель' })} назад`;
    } else if (diffMonth < 12) {
        return `${pluralize(diffMonth, { one: 'месяц', few: 'месяца', many: 'месяцев' })} назад`;
    } else {
        return `${pluralize(diffYear, { one: 'год', few: 'года', many: 'лет' })} назад`;
    }
}