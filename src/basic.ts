import type { KeyNameListFormat, Filters } from "@/types/types";
/**
 * Enum связывает код типа
 * предупреждения eventType из объекта event
 * и класс CSS устанавливающий цветовую схему предупреждения.
 * @property {number} warning
 * @property {number} danger
 * @property {number} primary
 * @readonly
 * @enum {number}
 */
export enum CodeEvent {
  warning = 1,
  danger = 2,
  primary = 3,
}

/**
 * Enum содержит статусы фильтра.
 * Отвечает за состояние кнопки фильтра. Возможно 3 состояния:
 * @property {number} Applied - кнопка заблокирована и неактивна
 * @property {number} Removed - фильтр применен
 * @property {number} Disabled - фильтр не применен
 * @readonly
 * @enum {number}
 */
export enum FilterStatus {
  Applied,
  Removed,
  Disabled,
}

/**
 * Переменная хранит количество миллисекунд в сутках.
 * @constant
 */
export const ALLDAYMS = 86400000;

/**
 * Массив содержит слова-указатели времен
 */
export const timeMarker = ["Вчера", "Сегодня", "Завтра", "Послезавтра"];

/**
 * Переменная хранит языковую метку для определения локали.
 * @constant
 */
export const LOCALES = "ru";

/**
 * Возможные значения формата отображения времени и даты.
 */
export const formatListDateTime: Record<KeyNameListFormat, string[]> = {
  d: ["day", "2-digit"],
  D: ["weekday", "short"],
  l: ["weekday", "long"],
  m: ["month", "2-digit"],
  F: ["month", "long"],
  M: ["month", "short"],
  Y: ["year", "numeric"],
  H: ["hour", "2-digit"],
  i: ["minute", "2-digit"],
  S: ["second", "2-digit"],
};

/**
 * Объект с дефолтными значениями свойств форматирования даты и времени.
 */
export const defaultOptionsDateTimeFormat: { [index: string]: string } = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

/**
 * Параметры для отображения иконки фильтра.
 */
export const filterIconOpen: string[] = [
  "filter-icon-open",
  "M3.5 4.5L3.5 8H4.5L4.5 4.5H8L8 3.5L4.5 3.5L4.5 0L3.5 0L3.5 3.5L0 3.5L0 4.5L3.5 4.5Z",
];

/**
 * Параметры для отображения иконки фильтра.
 */
export const filterIconClose: string[] = [
  "filter-icon-close",
  "M4.07115 4.7784L7.25309 7.96033L7.9602 7.25323L4.77826 4.07129L7.9602 0.88935L7.25309 0.182244L4.07115 3.36418L0.889129 0.18216L0.182022 0.889267L3.36404 4.07129L0.182022 7.25331L0.889129 7.96042L4.07115 4.7784Z",
];

/**
 * Сообщения, которые отображаются при отсутствии предупреждений.
 */
export const defaultEventMessage: string[] = [
  "В ближайшее время никаких значимых событий в погоде не ожидается :)",
  "Мы сразу сообщим, как появится что-то интересное.",
];

/**
 * Начальные настройки фильтров.
 */
export const defaultFilters: Filters = {
  3: { name: "Общие", amount: 0, status: 2 },
  1: { name: "Внимание", amount: 0, status: 2 },
  2: { name: "Опасно", amount: 0, status: 2 },
  5: { name: "Очень опасно", amount: 0, status: 2 },
  6: { name: "Неблагоприятно", amount: 0, status: 2 },
};

// export const monthNamesRu = [
//   "января",
//   "февраля",
//   "марта",
//   "апреля",
//   "мая",
//   "июня",
//   "июля",
//   "августа",
//   "сентября",
//   "октября",
//   "ноября",
//   "декабря",
// ];

// export const weekDaysRu = [
//   "воскресенье",
//   "понедельник",
//   "вторник",
//   "среда",
//   "четверг",
//   "пятница",
//   "суббота",
// ];

// export const shortWeekDaysRu = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
