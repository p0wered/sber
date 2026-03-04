import axios from 'axios';

/** Базовые утилиты валидации **/
function isEmpty(value: string): boolean {
    return !value || !value.trim();
}

function validateLength(value: string, expectedLength: number, errorMessage: string): string {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length !== expectedLength ? errorMessage : '';
}

function validateRegex(value: string, regex: RegExp, errorMessage: string): string {
    return !regex.test(value) ? errorMessage : '';
}

/** Обертка для валидаторов **/
function createValidator(
    validator: (value: string) => string,
    emptyMessage?: string
): (value: string, _form?: any, skipEmptyCheck?: boolean) => string {
    return (value: string, _form?: any, skipEmptyCheck = false): string => {
        const trimmed = value?.trim() || '';
        
        if (isEmpty(trimmed)) {
            return skipEmptyCheck ? '' : (emptyMessage || 'Поле не заполнено');
        }
        
        return validator(trimmed);
    };
}

/** Валидация номера телефона **/
export const validatePhone = createValidator(
    (phone: string) => validateLength(phone, 11, 'Пожалуйста, введите полный номер телефона'),
    'Введите номер телефона'
);

/** Валидация ФИО на наличие трех частей (фамилия, имя, отчество) **/
export const validateFullName = createValidator(
    (value: string) => {
        const parts = value.split(/\s+/).filter(part => part.length > 0);
        return parts.length < 3 ? 'Введите корректные ФИО' : '';
    },
    'Поле не заполнено'
);

/** Валидация Email **/
export const validateEmail = createValidator(
    (email: string) => validateRegex(
        email, 
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
        'Некорректный Email'
    ),
    'Введите электронную почту'
);

/** Проверка существования домена Email через API **/
export async function validateEmailDomain(email: string): Promise<{ isValid: boolean; message: string }> {
    try {
        const params = new URLSearchParams();
        params.append('action', 'email');
        params.append('email', email);

        const response = await axios.post('https://api.mfo-0.ru/check', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.response && response.data.response.err_code === 0) {
            return { isValid: true, message: '' };
        } else {
            return {
                isValid: false,
                message: 'К сожалению, мы не можем отправить письмо на эту почту. Пожалуйста, попробуйте другую почту.'
            };
        }
    } catch (error) {
        console.error('Ошибка проверки домена на существование:', error);
        // в случае ошибки запроса все равно отдаём isValid: true, чтобы не блокировать анкету
        return { isValid: true, message: '' };
    }
}

/** Проверка корректности даты **/
function isValidDate(day: number, month: number, year: number): boolean {
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
}

/** Вычисление возраста **/
function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/** Валидация даты рождения **/
export const validateBirthdayDate = createValidator(
    (date: string) => {
        const [day, month, year] = date.split('-').map(Number);
        
        if (!isValidDate(day, month, year)) {
            return 'Некорректная дата';
        }

        const birthDate = new Date(year, month - 1, day);
        const today = new Date();

        if (birthDate > today) {
            return 'Некорректная дата';
        }

        const age = calculateAge(birthDate);

        if (age < 18) {
            return 'Возраст должен быть не менее 18 лет';
        }

        if (age > 100) {
            return 'Возраст не может превышать 100 лет';
        }

        return '';
    },
    'Поле не заполнено'
);

/** Валидация даты выдачи паспорта **/
export const validateIssueDate = createValidator(
    (date: string) => {
        const [day, month, year] = date.split('-').map(Number);

        if (!isValidDate(day, month, year)) {
            return 'Некорректная дата';
        }

        const issueDate = new Date(year, month - 1, day);
        const today = new Date();

        if (issueDate > today || year < 1900) {
            return 'Некорректная дата';
        }

        return '';
    },
    'Поле не заполнено'
);

/** Валидация пола (проверка на выбор) **/
export const validateGender = createValidator(
    (_gender: string) => '',
    'Пожалуйста, выберите пол'
);

/** Валидация числовых полей с мин/макс **/
export function validateNumeric(value: number, min: number, max: number): string {
    if (value < min || value > max) {
        return `Значение для должно быть от ${min} до ${max}.`;
    }
    return '';
}

/** Валидация серии и номера паспорта **/
export const validatePassportSeriesAndNumber = createValidator(
    (value: string) => validateLength(value, 10, 'Введите полную серию и номер паспорта'),
    'Введите серию и номер паспорта'
);

/** Валидация кода подразделения **/
export const validateSubdivisionCode = createValidator(
    (value: string) => validateLength(value, 6, 'Пожалуйста, введите полный код подразделения (6 цифр)'),
    'Введите код подразделения'
);

/** Валидация номера карты **/
export const validateCardNumber = createValidator(
    (value: string) => validateLength(value, 10, 'Введите первые 6 и последние 4 цифры карты'),
    'Введите номер карты'
);