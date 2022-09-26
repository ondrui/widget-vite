import type { Data, Datakeys } from "./types/types";

export class DataClass implements Data {
  [index: string]:
    | number
    | number[]
    | string
    | boolean
    | undefined
    | (() => number);
  /**
   * eventType - Код типа предупреждения (важность). Будет предопределено
   * несколько типов предупреждений. Определяет цветовую схему и параметры
   * используемых шрифтов. Цветовые схемы будут подключаться в корневой
   * компоненте из отдельного файла.
   */
  eventType!: number;
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
  /**
   * Геттер - проверяет тип значения свойства eventTime и возвращает определенный timestamp
   */
  //timestamp: number;

  constructor(_event: Data) {
    for (const prop in _event) {
      const key = prop as Datakeys;

      this[prop] = _event[key];
    }
  }

  getTimestamp(): number {
    if (typeof this.eventTime === "number") {
      return this.eventTime;
    } else {
      return this.eventTime[0];
    }
  }
}
