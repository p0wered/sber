/**
 * Загружает данные из localStorage
 * @param formData реактивный объект для заполнения
 * @param localStorageKeys маппинг полей формы к ключам localStorage
 * @param specialHandlers специальные обработчики для определенных полей
 * @returns true если данные были загружены
 */
export function loadFromLocalStorage<T extends Record<string, any>>(
  formData: T,
  localStorageKeys: Record<keyof T, string>,
  specialHandlers?: Partial<Record<keyof T, (value: string) => any>>
): boolean {
  let hasLoadedData = false;

  for (const keyString in localStorageKeys) {
    const key = keyString as keyof T;
    const lsKey = localStorageKeys[key];
    const savedValue = localStorage.getItem(lsKey);

    if (savedValue !== null) {
      if (specialHandlers && specialHandlers[key]) {
        formData[key] = specialHandlers[key]!(savedValue);
      } else {
        formData[key] = savedValue as any;
      }
      hasLoadedData = true;
    }
  }

  return hasLoadedData;
}

/**
 * Сохраняет данные в localStorage
 * @param formData данные для сохранения
 * @param localStorageKeys маппинг полей формы к ключам localStorage
 * @param specialHandlers специальные обработчики для определенных полей
 */
export function saveToLocalStorage<T extends Record<string, any>>(
  formData: T,
  localStorageKeys: Record<keyof T, string>,
  specialHandlers?: Partial<Record<keyof T, (value: any) => string>>
): void {
  for (const keyString in localStorageKeys) {
    const key = keyString as keyof T;
    const lsKey = localStorageKeys[key];
    const valueToStore = formData[key];

    if (valueToStore === null || valueToStore === undefined || valueToStore === '') {
      localStorage.removeItem(lsKey);
    } else {
      if (specialHandlers && specialHandlers[key]) {
        localStorage.setItem(lsKey, specialHandlers[key]!(valueToStore));
      } else {
        localStorage.setItem(lsKey, String(valueToStore));
      }
    }
  }
}

/**
 * Создает композабл для работы с localStorage в step-компонентах
 * @param formData - реактивный объект formData
 * @param localStorageKeys - маппинг полей
 * @param emit - функция emit для уведомления родителя
 * @param specialHandlers - специальные обработчики
 */
export function useStepLocalStorage<T extends Record<string, any>>(
  formData: T,
  localStorageKeys: Record<keyof T, string>,
  emit: (event: 'update:formData', value: T) => void,
  specialHandlers?: {
    load?: Partial<Record<keyof T, (value: string) => any>>;
    save?: Partial<Record<keyof T, (value: any) => string>>;
  }
) {
  const loadData = () => {
    const hasLoadedData = loadFromLocalStorage(
      formData,
      localStorageKeys,
      specialHandlers?.load
    );

    if (hasLoadedData) {
      emit('update:formData', formData);
    }
  };

  const saveData = (newFormData: T) => {
    saveToLocalStorage(
      newFormData,
      localStorageKeys,
      specialHandlers?.save
    );
  };

  return {
    loadData,
    saveData
  };
}

/** Симуляция апи запроса для локальной отладки анкеты **/
export const simulateApiRequest = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Отправка данных через фейк запрос`);
      const success = Math.random() > 0.1;

      if (success) {
        resolve({ success: true, message: `Апи запрос успешно сработал` });
      } else {
        reject(new Error(`Ошибка фейк API`));
      }
    }, 1000);
  });
};