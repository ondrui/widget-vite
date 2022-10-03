import { createStore, Store } from "vuex";

import type { Data, Filters } from "@/types/types";
import { FilterStatus } from "@/basic";
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
      filters: {
        3: { name: "Общие", amount: 0, status: 2 },
        1: { name: "Внимание", amount: 0, status: 2 },
        2: { name: "Опасно", amount: 0, status: 2 },
        5: { name: "Очень опасно", amount: 0, status: 2 },
        6: { name: "Неблагоприятно", amount: 0, status: 2 },
      },
      events: [],
    };
  },
  mutations: {
    /**
     * Заполняет store данными, полученными с бэкэнда, предварительно их модифицировав.
     * @param state
     * @param payload Объект с фильтрами и массивом предупреждений
     */
    setData(state: RootState, payload: RootState): void {
      /**
       * Класс HandlerEvent добавляет в объект предупреждения методы,
       * которые будут применяться в дальнейшем.
       */
      state.events = payload.events.map(
        (event: Data) => new HandlerEvent(event)
      );
      /**
       * Вычисляется общее количество предупреждений с определенным типом и записывает
       * его в свойство amount объекта фильтра, а также присваивает свойству status значение
       *  FilterStatus.Applied если общее количество предупреждений больше 0 или
       * FilterStatus.Disabled, если общее количество предупреждений равно 0.
       */
      const filterObj = payload.filters;
      for (const key in filterObj) {
        filterObj[key].amount = state.events.filter(
          (f) => f.eventType === +key
        ).length;

        if (filterObj[key].amount > 0) {
          filterObj[key].status = FilterStatus.Applied;
        } else {
          filterObj[key].status = FilterStatus.Disabled;
        }
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
    changeFilterStatus(state: RootState, payload: number): void {
      /**
       * totalAppliedFilters возвращает общее количество примененных фильтров
       * @example
       * // returns 3
       */
      const totalAppliedFilters = (): number => {
        return Object.keys(state.filters).reduce(
          (previousValue: number, currentValue: string) => {
            if (state.filters[+currentValue].status === FilterStatus.Applied) {
              previousValue++;
            }
            return previousValue;
          },
          0
        );
      };
      /**
       * У данного фильтра проверяется значение свойства status.
       * Если оно равно FilterStatus.Applied, то вычисляется общее
       * количество фильтров с таким статусом. Если оно больше 1, то статус фильтра
       * меняется на FilterStatus.Removed.
       */

      const total = totalAppliedFilters();
      if (state.filters[payload].status === FilterStatus.Applied && total > 1) {
        state.filters[payload].status = FilterStatus.Removed;
      } else {
        /**
         * Если значение свойства status равно FilterStatus.Removed, то статус фильтра
         * меняется на FilterStatus.Applied.
         */
        state.filters[payload].status = FilterStatus.Applied;
      }
    },
  },
  getters: {
    /**
     * Возвращает копию объекта с настройками фильтров, полученными из store
     */
    addFilters(state: RootState): Filters {
      const copyFilter: Filters = JSON.parse(JSON.stringify(state.filters));
      return copyFilter;
    },
    /**
     * Возвращает общее количество примененных фильтров
     * @example
     * // returns 3
     */
    totalAppliedFilters(state: RootState): number {
      return Object.keys(state.filters).reduce(
        (previousValue: number, currentValue: string) => {
          if (state.filters[+currentValue].status === FilterStatus.Applied) {
            previousValue++;
          }
          return previousValue;
        },
        0
      );
    },
    /**
     * Возвращает копию массива объектов с предупреждениями отфильтрованные и отсортированные
     * по дате и времени. А также добавляет в объект опциональный параметр, который
     * отвечает за отображение блока с датой. Если true, то блок отрисовывается.
     */
    filteredEvents(state: RootState, getters): Data[] {
      const copyEvents = [...state.events];
      const filters = getters.addFilters;
      return (
        copyEvents
          .filter((event: HandlerEvent) => {
            return Object.keys(filters).some((key: string) => {
              return (
                event.eventType === +key &&
                filters[key].status === FilterStatus.Applied
              );
            });
          })
          .sort((event1: HandlerEvent, event2: HandlerEvent): number => {
            return event1.getTimestamp() - event2.getTimestamp();
          })
          /** Set the isDayShow property mapping the date block. */
          /**
           * Параметр isDayShow устанавливается в true если:
           * - индекс предупреждения равен 0
           * - у соседних предупреждений разная дата, то параметр isDayShow
           * устанавливается в true второму предупреждению.
           */
          .map((event: HandlerEvent, index: number, arr: HandlerEvent[]) => {
            if (index === 0) {
              return { ...event, isDayShow: true };
            }
            if (
              new Date(arr[index - 1].getTimestamp()).getDate() !==
              new Date(event.getTimestamp()).getDate()
            ) {
              return { ...event, isDayShow: true };
            } else {
              return { ...event, isDayShow: false };
            }
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
