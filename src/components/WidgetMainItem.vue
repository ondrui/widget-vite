<template>
  <!--
    Условия отображения блока с датой:
    - свойство isDayShow объекта event, который приходит через пропсы, установлено в true и указано слово порядка даты setDayInDayInfo[0].
  -->
  <div
    class="day-info"
    :class="index !== 0 ? '' : 'day-info-zero-index'"
    v-show="event.isDayShow && setDayInDayInfo[0]"
  >
    <span class="day-info-name">
      <strong>{{ setDayInDayInfo[0] }}: </strong>
    </span>
    <span class="day-info-number-month">{{ setDayInDayInfo[1] }}</span>
  </div>
  <div class="container-item" :class="setEvent">
    <div class="top-info">
      <div class="time">{{ setTimeEvent }}</div>
      <div class="title" :title="event.titleText">{{ event.titleText }}</div>
    </div>
    <div class="block">
      <div v-if="event.iconCode" class="icon">
        <img :src="setUrlIcon" alt="icon" />
      </div>
      <div class="text">{{ event.eventText }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Data } from "@/types/types";
/**
 * Интерфейс для объекта со свойствами, которые связывают код типа
 * предупреждения eventType из объекта event
 * и класс CSS устанавливающий цветовую схему предупреждения.
 */
interface CodeColor {
  [index: number]: string;
}
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
     * и необходимасть отображения блока даты.
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
    index: Number,
  },
  data() {
    return {
      codeColor: {
        3: "primary",
        1: "warning",
        2: "danger",
      } as CodeColor,
      iconItem: {
        2: "wind",
        1: "uv-index",
      } as IconItem,
    };
  },
  computed: {
    /**
     * Геттер для полуяения класса CSS цветовой схемы предупреждения
     * @example
     * // returns 'warning'
     */
    setEvent(): string {
      return this.event.eventType
        ? this.codeColor[this.event.eventType]
        : (console.log("несуществующий код eventType"), "primary");
    },
    /**
     * Геттер для получения пути к файлу с иконкой
     * @example
     * // returns '@/assets/images/uv-index.svg'
     */
    setUrlIcon(): string {
      return this.event.iconCode
        ? new URL(
            `../assets/images/${this.iconItem[this.event.iconCode]}.svg`,
            import.meta.url
          ).href
        : (console.log("нет иконки"), "#");
    },
    /**
     * Геттер для получения время действия предупреждения и его срока.
     * Может быть точным (одно значение) или интервальным (два значения).
     * @example
     * // returns 'с 08:00 вчера до 16:30 послезавтра'
     * // returns '08:00'
     */
    setTimeEvent(): string {
      /**
       * Проверка значения свойства eventTime и преобразование этого значения в нужный
       * формат отображения времени.
       */
      if (typeof this.event.eventTime === "number") {
        let date = new Date(this.event.eventTime).toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit",
        });
        return date;
      } else {
        let date1 = new Date(this.event.eventTime[0]).toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit",
        });
        let date2 = new Date(this.event.eventTime[1]).toLocaleTimeString("ru", {
          hour: "2-digit",
          minute: "2-digit",
        });

        /**
         * Логика добавления доп слов после времени.
         */
        //let midnightTodayTimestamp = new Date().setHours(0, 0, 0, 0);
        //test date
        let midnightTodayTimestamp = 1662670800000; //09.09.2022 00:00
        const allDayMs = 86400000;
        let timeStamp1 = this.event.eventTime[0];
        let timeStamp2 = this.event.eventTime[1];

        let diffDate1 = midnightTodayTimestamp - timeStamp1;
        let diffDate2 = (timeStamp2 - midnightTodayTimestamp) / allDayMs;

        const setDate1 = (diff: number, curr: string): string => {
          if (diff > 0) {
            return `${curr} вчера`;
          } else {
            return `${curr}`;
          }
        };

        const setDate2 = (diff: number, curr: string): string => {
          if (diff > 0 && diff <= 1) {
            return `${curr}`;
          } else if (diff > 1 && diff <= 2) {
            return `${curr} завтра`;
          } else if (diff > 2) {
            return `${curr} послезавтра`;
          } else {
            return `${curr}`;
          }
        };
        return `с ${setDate1(diffDate1, date1)} до ${setDate2(
          diffDate2,
          date2
        )}`;
      }
    },
    /**
     * Геттер для получения массива значений блока даты.
     * @example
     * // returns ["Послезавтра","11 сентября"]
     */
    setDayInDayInfo(): string[] {
      const name = ["Сегодня", "Завтра", "Послезавтра", "Вчера"];

      const dateTimestamp =
        typeof this.event.eventTime === "number"
          ? this.event.eventTime
          : this.event.eventTime[0];

      let options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
      };

      const date = new Date(dateTimestamp).toLocaleString("ru", options);
      const dayName = new Date(dateTimestamp).getDate();
      switch (dayName) {
        case new Date(1662727200000).getDate():
          return [name[0], date];
        case new Date(1662727200000).getDate() + 1:
          return [name[1], date];
        case new Date(1662727200000).getDate() + 2:
          return [name[2], date];
        case new Date(1662727200000).getDate() - 1:
          return [name[3], date];
        default:
          return console.log("неверный диапазон"), ["", ""];
      }
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
