import { reactive } from 'vue';

export type ValidatorFn<T = any> = (value: T, form: Record<string, any>, skipEmptyCheck?: boolean) => string;
export type ValidatorsMap<T extends Record<string, any>> = {
	[K in keyof T]?: ValidatorFn<T[K]>;
};

export interface UseValidationResult<T extends Record<string, any>> {
	errors: Record<keyof T, string>;
	validateField: (field: keyof T, skipEmptyCheck?: boolean) => boolean;
	validateFieldOnBlur: (field: keyof T) => boolean;
	clearField: (field: keyof T) => void;
	setFieldError: (field: keyof T, message: string) => void;
	validateAll: () => boolean;
	hasErrors: () => boolean;
	getError: (field: keyof T) => string;
}

/** Проверка, является ли значение пустым **/
function isEmptyValue(value: any): boolean {
	if (value === null || value === undefined) return true;
	if (typeof value === 'string') return !value.trim();
	if (typeof value === 'boolean') return false;
	return !value;
}

export function useValidation<T extends Record<string, any>>(
	form: T,
	validators: ValidatorsMap<T>
): UseValidationResult<T> {
	const errors = reactive<Record<keyof T, string>>({} as Record<keyof T, string>);

	const validateField = (field: keyof T, skipEmptyCheck = false): boolean => {
		const validator = validators[field];
		if (!validator) {
			(errors as any)[field] = '';
			return true;
		}
		
		const message = validator(form[field], form, skipEmptyCheck);
		(errors as any)[field] = message || '';
		return !message;
	};

	const validateFieldOnBlur = (field: keyof T): boolean => {
		const value = form[field];
		
		if (isEmptyValue(value)) {
			(errors as any)[field] = '';
			return true;
		}
		
		return validateField(field, true);
	};

	const clearField = (field: keyof T): void => {
		(errors as any)[field] = '';
	};

	const setFieldError = (field: keyof T, message: string): void => {
		(errors as any)[field] = message;
	};

	const validateAll = (): boolean => {
		let isValid = true;
		
		for (const key in validators) {
			if (!validateField(key, false)) {
				isValid = false;
			}
		}
		
		return isValid;
	};

	const hasErrors = (): boolean => {
		return Object.values(errors).some((error) => Boolean(error));
	};

	const getError = (field: keyof T): string => {
		return (errors as any)[field] || '';
	};

	return {
		errors: errors as Record<keyof T, string>,
		validateField,
		validateFieldOnBlur,
		clearField,
		setFieldError,
		validateAll,
		hasErrors,
		getError
	};
}
