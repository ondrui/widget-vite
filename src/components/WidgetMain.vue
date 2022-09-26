<template>
  <div class="widget">
    <h1>Главное</h1>
    <WidgetFilters
      @filtered="changeFilterActive"
      :filters="filters"
      :totalActiveFilters="totalActiveFilters"
    />
    <div class="wrapper">
      <div class="container-main">
        <WidgetMainItem
          v-for="({ event }, index) in filteredEvents"
          :key="`wn-${index}`"
          :event="event"
          :index="+index"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WidgetMainItem from "./WidgetMainItem.vue";
import WidgetFilters from "./WidgetFilters.vue";
import type { Filters } from "@/types/types";
import type { DataClass } from "./../DataClass";

export default defineComponent({
  components: {
    WidgetMainItem,
    WidgetFilters,
  },
  data() {
    return {
      events: [] as DataClass[],
      filters: [] as Filters[],
    };
  },
  created() {
    this.events = this.it();
    this.filters = this.initialfilters();
    this.amount();
  },
  computed: {
    /**
     * Метод возвращает массив объектов с предупреждениями отфильтрованные и отсортированные
     * по дате и времени. А также добавляет в объект опциональный параметр, который
     * отвечает за отображение блока с датой. Если true, то блок отрисовывается.
     */
    filteredEvents(): DataClass[] {
      let filters = this.filters;
      /**
       * Проверяет тип значения свойства eventTime и возвращает определенный timestamp
       * согласно этому.
       * @param {DataClass} event - объект со свойствами, которые определяют
       * содержание, внешний вид предупреждения
       */
      // const computedEventTime = (event: Data): number => {
      //   if (typeof event.eventTime === "number") {
      //     return event.eventTime;
      //   } else {
      //     return event.eventTime[0];
      //   }
      // };

      return (
        this.events
          .filter((event) => {
            return filters.some((f) => {
              return f.code === event.eventType && f.isActive;
            });
          })
          .sort((event1, event2): number => {
            return event1.timestamp() - event2.timestamp();
          })
          /**
           * Параметр isDayShow устанавливается в true если:
           * - индекс предупреждения равен 0
           * - у соседних предупреждений разная дата, то параметр isDayShow
           * устанавливается в true второму предупреждению.
           */
          .map((event, index: number, arr: DataClass[]) => {
            if (index === 0) {
              return { ...event, isDayShow: true };
            }
            if (
              new Date(arr[index - 1].timestamp()).getDate() !==
              new Date(event.timestamp).getDate()
            ) {
              return { ...event, isDayShow: true };
            } else {
              return { ...event, isDayShow: false };
            }
          })
      );
    },
    /**
     * Возвращает общее количество примененных фильтров
     * @example
     * // returns 3
     */
    totalActiveFilters(): number {
      return this.filters.reduce(
        (previousValue, currentValue) =>
          currentValue.isActive ? ++previousValue : previousValue,
        0
      );
    },
  },
  methods: {
    /**
     * Возвращает массив объектов с предупреждениями, полученными из store
     */
    it() {
      return this.$store.state.events;
    },
    /**
     * Возвращает массив объектов с фильтрами, полученными из store
     */
    initialfilters(): Filters[] {
      return this.$store.getters.getFilters;
    },
    /**
     * Метод вызывается когда пользователь кликает на кнопку фильтра или
     * кнопку 'Показать все'.
     * Параметром принимает объект со свойствами выбранного фильтра или число 100
     *
     * Если параметр равен 100, то применяются ВСЕ фильтры у которых общее
     * количество предупреждений больше 0.
     *
     * Если принимается объект, то у данного фильтра меняется свойство isActive на
     * противоположное при условии, что у него общее количество предупреждений
     * больше 0.
     *
     * @param {Filters} filter
     */
    changeFilterActive(filter: Filters | 100) {
      if (filter === 100) {
        this.filters = this.filters.map((f) => {
          return { ...f, isActive: f.amount > 0 };
        });
      } else {
        this.filters = this.filters.map((f) =>
          f.code === filter.code && f.amount > 0
            ? { ...f, isActive: !f.isActive }
            : f
        );
      }
    },
    /**
     * Метод вычисляет общее количество предупреждений с определенным типом и записывает
     * его в свойство amount объекта фильтра, а также устанавливает свойство isActive в
     * true если общее количество предупреждений больше 0.
     *
     * Возвращает обновленный массив фильтров.
     */
    amount() {
      this.filters = this.filters.map((f) => {
        const filterAmount = this.events.reduce(
          (previousValue, currentValue) => {
            if (currentValue.event.eventType === f.code) {
              return ++previousValue;
            }
            return previousValue;
          },
          0
        );
        return { ...f, amount: filterAmount, isActive: filterAmount > 0 };
      });
    },
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";
.widget {
  border-radius: 12px;
  min-width: 300px;
  height: 100%;
  background: $color-white;
  box-shadow: 0px 1px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  & h1 {
    margin: 18px 0 0 19px;
    font-weight: 500;
    font-size: 22px;
    line-height: 26px;
  }
}
.wrapper {
  margin: 14px 4px 10px 10px;
  // height: calc(100% - 101px);
  max-height: 448px;
  display: flex;
}
.container-main {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 10px 6px 1px 0;
  flex-basis: 100%;
}
// @media screen and (max-width: 630px) {
//   .wrapper {
//     height: calc(100% - 125px);
//   }
// }
// @media screen and (max-width: 365px) {
//   .wrapper {
//     height: calc(100% - 150px);
//   }
// }
</style>
