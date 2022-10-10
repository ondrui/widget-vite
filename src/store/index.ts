import { createStore, Store } from "vuex";

import type { Data, Filters, Filter } from "@/types/types";
import { FilterStatus, defaultFilters } from "@/basic";
import { HandlerEvent } from "./../handlers/HandlerEvent";

interface RootState {
  filters: Filters;

  events: HandlerEvent[];
}

const store = createStore<RootState>({
  state() {
    return {
      /**
       * Начальные настройки фильтров.
       */
      filters: defaultFilters,
      events: [],
    };
  },
  actions: {
    /**
     *
     * @param param
     * @param payload
     */
    changeFilterStatus({ commit, getters }, payload: number) {
      const total: number = getters.calcTotalFilters(FilterStatus.Applied);
      commit("changeFilterStatus", [total, payload]);
    },
  },
  mutations: {
    /**
     * Заполняет store данными, полученными с бэкэнда, предварительно их модифицировав.
     * @param state
     * @param payload Объект с фильтрами и массивом предупреждений
     */
    setData(
      state: RootState,
      payload: { events?: Data[]; filters?: Filters }
    ): void {
      let { events, filters } = payload;
      if (events == null) {
        events = [];
      }

      if (filters == null) {
        filters = [];
      }
      /**
       * Класс HandlerEvent добавляет в объект предупреждения методы,
       * которые будут применяться в дальнейшем.
       */
      state.events = events.map((event: Data) => new HandlerEvent(event));
      /**
       * Вычисляется общее количество предупреждений с определенным типом и записывает
       * его в свойство amount объекта фильтра, а также присваивает свойству status значение
       *  FilterStatus.Applied если общее количество предупреждений больше 0 или
       * FilterStatus.Disabled, если общее количество предупреждений равно 0.
       */
      const filterObj = filters;
      for (const key in filterObj) {
        filterObj[key].amount = state.events?.filter(
          (f) => f.eventType === +key
        ).length;

        filterObj[key].status =
          filterObj[key].amount > 0
            ? FilterStatus.Applied
            : FilterStatus.Disabled;
      }
      state.filters = filterObj;
    },

    /**
     * Вызывается когда пользователь кликает на
     * кнопку 'Показать все'.
     * Применяются ВСЕ фильтры у которых общее
     * количество предупреждений больше 0.
     */
    resetFilters(state: RootState): void {
      for (const key in state.filters) {
        if (state.filters[key].amount > 0) {
          state.filters[key].status = FilterStatus.Applied;
        }
      }
    },

    /**
     * Вызывается когда пользователь кликает на кнопку фильтра.
     * @param {number} payload Параметром принимает код
     * выбранного фильтра
     */
    changeFilterStatus(state: RootState, payload: number[]): void {
      /**
       * У фильтра проверяется значение свойства status.
       *
       * Если оно равно FilterStatus.Applied, то вычисляется общее
       * количество фильтров с таким статусом. Если оно больше 1, то статус фильтра
       * меняется на FilterStatus.Removed.
       *
       * Если значение свойства status равно FilterStatus.Removed, то статус фильтра
       * меняется на FilterStatus.Applied.
       */

      state.filters[payload[1]].status =
        state.filters[payload[1]].status === FilterStatus.Applied &&
        payload[0] > 1
          ? FilterStatus.Removed
          : FilterStatus.Applied;
    },
  },
  getters: {
    /**
     * Возвращает копию объекта с настройками фильтров, полученными из store
     */
    getFilters(state: RootState): Filters {
      const copyFilter: Filters = JSON.parse(JSON.stringify(state.filters));
      return copyFilter;
    },
    /**
     * Вычисляет и возвращает общее количество фильтров со статусом FilterStatus.Applied.
     * @example
     * @param state
     * @returns
     * // returns 3
     */
    calcTotalFilters:
      (state: RootState): ((status: FilterStatus) => number) =>
      (status: FilterStatus): number => {
        return Object.values(state.filters).reduce<number>(
          (previousValue: number, currentValue: Filter) =>
            currentValue.status === status ? previousValue + 1 : previousValue,
          0
        );
      },
    /**
     * Возвращает копию массива объектов с предупреждениями отфильтрованные и отсортированные
     * по дате и времени. А также добавляет в объект опциональный параметр, который
     * отвечает за отображение блока с датой. Если true, то блок отрисовывается.
     */
    getFilteredAndSortedEvents(state: RootState, getters): Data[] {
      const copyEvents = [...state.events];
      const filters: Filters = getters.getFilters;
      return (
        copyEvents
          .filter(
            (event: HandlerEvent) =>
              filters[event.eventType].status === FilterStatus.Applied
          )
          .sort((event1: HandlerEvent, event2: HandlerEvent): number => {
            return event1.getTimestamp() - event2.getTimestamp();
          })
          /** Set the isDayShow property mapping the date block. */
          /**
           * Значение свойства isDayShow устанавливается в true если:
           * - индекс предупреждения равен 0 или
           * - у соседних предупреждений разная дата, то параметр isDayShow
           * устанавливается в true второму предупреждению.
           */
          .map((event: HandlerEvent, index: number, arr: HandlerEvent[]) => {
            return {
              ...event,
              isDayShow:
                index === 0 ||
                new Date(arr[index - 1].getTimestamp()).getDate() !==
                  new Date(event.getTimestamp()).getDate(),
            };
          })
      );
    },
  },
});

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<RootState>;
  }
}

export default store;
