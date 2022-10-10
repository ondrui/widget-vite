import type { Data, Datakeys, KeyNameListFormat } from "../types/types";
import {
  CodeEvent,
  defaultOptionsDateTimeFormat,
  LOCALES,
  formatListDateTime,
} from "@/basic";
/**
 * Класс HandlerEvent модифицирует данные из объекта предупреждения в соответствии с
 * потребностью компоненты.
 * @class
 */
export class HandlerEvent implements Data {
  [index: string]:
    | number
    | number[]
    | string
    | boolean
    | undefined
    | (() => number)
    | ((timestamp: number, format: string) => string);
  /**
   * eventType - Код типа предупреждения (важность). Будет предопределено
   * несколько типов предупреждений. Определяет цветовую схему и параметры
   * используемых шрифтов. Цветовые схемы будут подключаться в корневой
   * компоненте из отдельного файла.
   */
  eventType!: CodeEvent;
  /**
   * eventTime - Время действия предупреждения. Может быть точным (одно
   * значение) или интервальным (два значения). Значение времени передается в
   * формате timestamp.
   */
  eventTime!: number | number[];
  /**
   * timeFormat -  Формат отображения времени. Возможные варианты:
   * часы:минуты; часы:минуты день:месяц; другие.
   */
  timeFormat!: string;
  /**
   * titleText -  Текст заголовка.
   */
  titleText!: string;
  /**
   * eventText - Текст предупреждения.
   */
  eventText!: string;
  /**
   * iconCode - Опциональный параметр. Код иконки предупреждения. Компонента
   * такой иконки будет создана позднее. Компонента будет представлять собой
   * графическое изображение в формате svg (на которое также будет
   * распространяться цветовая схема заданная типом предупреждения). Поэтому
   * предполагается передача в нее через Property кода, для отображения.
   */
  iconCode?: number;
  /**
   * isDayShow - Опциональный параметр. Отвечает за отображение блока с датой.
   * Если true, то блок отрисовывается.
   */
  isDayShow?: boolean;

  constructor(_event: Data) {
    for (const prop in _event) {
      const key = prop as Datakeys;
      this[prop] = _event[key];
    }
  }
  /**
   * Метод проверяет тип значения свойства eventTime и возвращает определенный timestamp
   */
  //timestamp: number;
  getTimestamp = (): number =>
    typeof this.eventTime === "number" ? this.eventTime : this.eventTime[0];

  /**
   * Возвращает строку с датой и временем в заданном формате.
   * @param timestamp Числовое значение даты.
   * @param format Строковое представление формата.
   * @example
   * // returns "20:30"
   */
  static setTimeFormat(timestamp: number, format: string): string {
    const options = { ...defaultOptionsDateTimeFormat };

    /**
     * Формируем объект с заданными свойствами форматирования даты и времени.
     */
    for (const key in formatListDateTime) {
      const value = formatListDateTime[key as KeyNameListFormat];
      if (format.includes(key)) {
        options[value[0]] = value[1];
      }
    }

    /**
     * Массив объектов, содержащий отформатированную дату по частям.
     */
    const datePartsArr = new Intl.DateTimeFormat(
      LOCALES,
      options
    ).formatToParts(timestamp);

    /**
     * Формируем строку дата-время с заданным форматированием.
     */
    let dateFormated = format;
    for (const key in formatListDateTime) {
      const value = formatListDateTime[key as KeyNameListFormat];
      const item = datePartsArr.find((i) => i.type === value[0]);
      dateFormated = dateFormated.replace(key, item == null ? "" : item.value);
    }

    return dateFormated;
  }
}
