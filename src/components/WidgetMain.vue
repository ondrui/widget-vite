<template>
  <div class="widget">
    <h1>Главное</h1>
    <WidgetFilters
      :filters="getfilters"
      :totalAppliedFilters="totalAppliedFilters"
    />
    <div class="wrapper">
      <div v-if="getEvents.length" class="container-main">
        <WidgetMainItem
          v-for="(event, index) in getEvents"
          :key="`wn-${index}`"
          :event="event"
          :index="+index"
        />
      </div>
      <div class="default-event" v-else>
        <div>
          В ближайшее время никаких значимых событий в погоде не ожидается :)
        </div>
        <div>Мы сразу сообщим, как появится что-то интересное.</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WidgetMainItem from "./WidgetMainItem.vue";
import WidgetFilters from "./WidgetFilters.vue";
import type { Data, Filters } from "@/types/types";

export default defineComponent({
  components: {
    WidgetMainItem,
    WidgetFilters,
  },
  computed: {
    /**
     * Возвращает массив объектов с предупреждениями, полученными из store
     */
    getEvents(): Data[] {
      return this.$store.getters.filteredEvents;
    },
    /**
     * Возвращает объект с фильтрами, полученными из store
     */
    getfilters(): Filters {
      return this.$store.getters.addFilters;
    },
    /**
     * Возвращает общее количество примененных фильтров
     * @example
     * // returns 3
     */
    totalAppliedFilters(): number {
      return this.$store.getters.totalAppliedFilters;
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
.default-event {
  width: 100%;
  margin: 21px 5px 10px 0px;
  padding: 14px 15px;
  background: $color-filters-day-dark;
  color: $color-filters-day-darker;
  border-radius: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  & > div {
    margin-bottom: 15px;
  }
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
