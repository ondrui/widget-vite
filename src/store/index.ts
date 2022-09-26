import { createStore, Store } from "vuex";
import type { Filters } from "@/types/types";
import { DataClass } from "./../DataClass";

interface RootState {
  filters: Filters[];

  events: DataClass[];
}

const store = createStore<RootState>({
  state() {
    return {
      filters: [
        { code: 3, amount: 0, name: "Общие", isActive: true },
        { code: 1, amount: 0, name: "Внимание", isActive: true },
        { code: 2, amount: 0, name: "Опасно", isActive: true },
        { code: 5, amount: 0, name: "Очень опасно", isActive: true },
        { code: 6, amount: 0, name: "Неблагоприятно", isActive: true },
      ],
      events: [
        new DataClass({
          eventType: 1,
          eventTime: [1662624030000, 1662730230000],
          timeFormat: `year, month, day`,
          titleText: `внимание`,
          eventText: `1-Thursday, September 8th 2022, 11:00:30 am Максимальный уровень ультрофиолетового излучения за день`,
          iconCode: 1,
        }),
        new DataClass({
          eventType: 2,
          eventTime: 1662790800000,
          timeFormat: `year, month, day`,
          titleText: `сильный ветер`,
          eventText: `2-Saturday, September 10th 2022, 9:20:00 am 10 сентября 2022 года, с 10 часов до 21 часов в Москве и ТиНАО и в Московской области ожидается сильный ветер с порывами 12 - 15 м/с.`,
          iconCode: 2,
        }),
        new DataClass({
          eventType: 3,
          eventTime: 1662700980000,
          timeFormat: `year, month, day`,
          titleText: `заход солнца`,
          eventText: `3-Friday, September 9th 2022, 8:23:00 am Заход солнца сегодня в 20:23, на 5 минут позже чем вчера, продолжительность дня составила 12 ч. 43 мин. (+ 15 мин.)`,
        }),
        new DataClass({
          eventType: 2,
          eventTime: 1662699600000,
          timeFormat: `year, month, day`,
          titleText: `сильный ветер`,
          eventText: `4-Friday, September 9th 2022, 8:00:00 am Сегодня в Москве и области ожидается усиление ветра с порывами до 22 м/с`,
          iconCode: 2,
        }),
        new DataClass({
          eventType: 1,
          eventTime: [1662700500000, 1662818400000],
          timeFormat: `year, month, day`,
          titleText: `внимание`,
          eventText: `5-Friday, September 9th 2022, 8:15:00 am Максимальный уровень ультрофиолетового излучения за день.`,
          iconCode: 1,
        }),
        new DataClass({
          eventType: 3,
          eventTime: 1662742800000,
          timeFormat: `year, month, day`,
          titleText: `заход солнца`,
          eventText: `6-Friday, September 9th 2022, 8:00:00 pm Заход солнца сегодня в 20:23, на 5 минут позже чем вчера, продолжительность дня составила 12 ч. 43 мин. (+ 15 мин.). Lorem ipsum dolor sit amet consectetur, adipisicing elit.`,
        }),
        new DataClass({
          eventType: 2,
          eventTime: 1662913800000,
          timeFormat: `year, month, day`,
          titleText: `сильный ветер`,
          eventText: `7-Sunday, September 11th 2022, 7:30:00 pm В Москве и области ожидается усиление ветра с порывами до 22 м/с. Заход солнца сегодня в 20:23, на 5 минут позже чем вчера, продолжительность дня составила 12 ч. 43 мин. (+ 15 мин.)`,
          iconCode: 2,
        }),
        new DataClass({
          eventType: 1,
          eventTime: [1662613200000, 1663075800000],
          timeFormat: `year, month, day`,
          titleText: `внимание`,
          eventText: `8-Thursday, September 8th 2022, 8:00:00 am Максимальный уровень ультрофиолетового излучения за день.`,
          iconCode: 1,
        }),
        new DataClass({
          eventType: 2,
          eventTime: 1662702000000,
          timeFormat: `year, month, day`,
          titleText: `сильный ветер`,
          eventText: `9-Friday, September 9th 2022, 8:40:00 am 9 сентября 2022 года, с 10 часов до 20 часов в Москве и ТиНАО и в Московской области ожидается сильный ветер с порывами 12 - 17 м/с.`,
          iconCode: 2,
        }),
      ],
    };
  },
  mutations: {},
  getters: {
    getFilters(state) {
      return state.filters;
    },
    getEvents(state) {
      return state.events;
    },
  },
});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}

export default store;
