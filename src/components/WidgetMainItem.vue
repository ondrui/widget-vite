<template>
  <!--
    Условия отображения блока с датой:
    - свойство isDayShow объекта event, который приходит через пропсы,
      установлено в true и указано слово порядка даты setDayInDayInfo[0].
  -->
  <div
    :class="'day-info ' + (index !== 0 ? '' : 'day-info-zero-index')"
    v-show="event.isDayShow && calcDayInDayInfo[0]"
  >
    <span class="day-info-name">
      <strong>{{ calcDayInDayInfo[0] }}: </strong>
    </span>
    <span class="day-info-number-month">{{ calcDayInDayInfo[1] }}</span>
  </div>
  <div :class="'container-item ' + EventColorScheme">
    <div class="top-info">
      <div class="time">{{ calcTimeEvent }}</div>
      <div class="title" :title="event.titleText">{{ event.titleText }}</div>
    </div>
    <div class="block">
      <div v-if="event.iconCode" class="icon">
        <img :src="UrlIcon" alt="icon" />
      </div>
      <div class="text">{{ event.eventText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Data } from "@/types/types";
import { HandlerEvent } from "@/handlers/HandlerEvent";
import { CodeEvent, ALLDAYMS, timeMarker, LOCALES } from "@/basic";

/**
 * Интерфейс для объекта со свойствами, которые связывают код иконки
 * предупреждения iconCode из объекта event и названием файла иконки.
 */
interface IconItem {
  [index: number]: string;
}

export default defineComponent({
  props: {
    /**
     * Объект со свойствами, которые определяют содержание, внешний вид предупреждения
     * и необходимость отображения блока даты.
     * @example
     * {"eventType":1,
     * "eventTime":[1662613200000,1663075800000],
     * "timeFormat":"year, month, day",
     * "titleText":"внимание",
     * "eventText":"8-Thursday, September 8th 2022, 8:00:00 am Максимальный уровень
     * ультрофиолетового излучения за день.",
     * "iconCode":1,
     * "isDayShow":true}
     */
    event: {
      type: Object as PropType<Data>,
      required: true,
    },
    /**
     * Порядковый индекс предупреждения. Необходим для установки доп класса CSS
     * 'day-info-zero-index'  предупреждению с индексом 0.
     */
    index: { type: Number, required: true },
  },
  data() {
    return {
      /**
       * Объект со свойствами, которые связывают код иконки
       * предупреждения iconCode из объекта event и названием файла иконки.
       */
      iconItem: {
        2: "wind",
        1: "uv-index",
      } as IconItem,
    };
  },
  computed: {
    /**
     * Геттер для получения класса CSS цветовой схемы предупреждения из enum CodeEvent.
     * @example
     * // returns 'warning'
     */
    EventColorScheme(): string {
      return this.event.eventType
        ? CodeEvent[this.event.eventType]
        : (console.log("несуществующий код eventType"), "primary");
    },
    /**
     * Геттер для получения пути к файлу с иконкой
     * @example
     * // returns '@/assets/images/uv-index.svg'
     */
    UrlIcon(): string {
      return this.event.iconCode
        ? new URL(
            `../assets/images/${this.iconItem[this.event.iconCode]}.svg`,
            import.meta.url
          ).href
        : (console.log("нет иконки"), "#");
    },
    /**
     * Геттер для вычисления время действия предупреждения и его срока.
     * Может быть точным (одно значение) или интервальным (два значения).
     * @example
     * // returns 'с 08:00 вчера до 16:30 послезавтра'
     * // returns '08:00'
     */
    calcTimeEvent(): string {
      /**
       * Проверка значения свойства eventTime и преобразование этого значения в нужный
       * формат отображения времени.
       */
      if (typeof this.event.eventTime === "number") {
        return HandlerEvent.setTimeFormat(
          this.event.eventTime,
          this.event.timeFormat
        );
      }

      const [timeStamp1, timeStamp2] = this.event.eventTime;

      /**
       * Логика добавления доп слов после времени.
       */
      return `с ${HandlerEvent.setTimeFormat(
        timeStamp1,
        this.event.timeFormat
      )} ${
        this.getTimeMarker(timeStamp1) === timeMarker[0]
          ? this.getTimeMarker(timeStamp1).toLocaleLowerCase()
          : ""
      } до ${HandlerEvent.setTimeFormat(timeStamp2, this.event.timeFormat)} ${
        this.getTimeMarker(timeStamp2) === timeMarker[1]
          ? ""
          : this.getTimeMarker(timeStamp2).toLocaleLowerCase()
      }`;
    },
    /**
     * Геттер для получения массива значений блока даты.
     * @example
     * // returns ["Послезавтра","11 сентября"]
     */
    calcDayInDayInfo(): string[] {
      const dateTimestamp = new HandlerEvent(this.event).getTimestamp();
      let options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
      };
      const date = new Date(dateTimestamp).toLocaleString(LOCALES, options);
      return [this.getTimeMarker(dateTimestamp), date];
    },
  },
  methods: {
    /**
     * Возвращает название дня в виде строки.
     * @param timestamp Числовое значение даты предупреждения.
     * @example
     * // returns ["Послезавтра"]
     */
    getTimeMarker(timestamp: number): string {
      let diff = Math.floor(
        (timestamp - (new Date().setHours(0, 0, 0, 0) - ALLDAYMS)) / ALLDAYMS
      );
      return timeMarker[diff] ?? (console.log("неверный диапазон"), "");
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";
.container-item {
  border-radius: 10px;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  // letter-spacing: 0.2px;
}
.day-info {
  margin: 16px auto 0 auto;
  padding: 4px 6px;
  background: $color-filters-day-dark;
  color: $color-filters-day-darker;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
}
.day-info-zero-index {
  margin: 5px auto 0 auto;
}
.top-info,
.time,
.title {
  border-radius: 10px;
}
.top-info {
  display: inline-flex;
}
.time {
  line-height: 16px;
  text-align: center;
  padding: 4px 8px 2px 8px;
}
.title {
  padding: 4px 15px 3px 11px;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.block {
  display: flex;
  margin: 16px 21px 15px 16px;
}
.icon {
  display: flex;
  align-items: flex-start;
  margin: 6px;
}
.text {
  word-wrap: break-word;
  hyphens: auto;
  // text-align: justify;
}
</style>
