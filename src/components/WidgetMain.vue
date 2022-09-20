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
          v-for="(event, index) in filteredEvents"
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
import type { Data, Filters } from "@/types/types";

export default defineComponent({
  components: {
    WidgetMainItem,
    WidgetFilters,
  },
  data() {
    return {
      events: [] as Data[],
      filters: [] as Filters[],
    };
  },
  created() {
    this.events = this.it();
    this.filters = this.initialfilters();
    this.amount();
  },
  computed: {
    filteredEvents(): Data[] {
      let filters = this.filters;

      const computedEventTime = (event: Data): number => {
        if (typeof event.eventTime === "number") {
          return event.eventTime;
        } else {
          return event.eventTime[0];
        }
      };

      return (
        this.events
          .filter((event) => {
            return filters.some((f) => {
              return f.code === event.eventType && f.isActive;
            });
          })
          .sort((event1, event2): number => {
            return computedEventTime(event1) - computedEventTime(event2);
          })
          /** Set the isDayShow property mapping the date block. */
          .map((event: Data, index: number, arr: Data[]) => {
            //!!!!
            if (index === 0) {
              return { ...event, isDayShow: true };
            }
            if (
              new Date(computedEventTime(arr[index - 1])).getDate() !==
              new Date(computedEventTime(event)).getDate()
            ) {
              return { ...event, isDayShow: true };
            } else {
              return { ...event, isDayShow: false };
            }
          })
      );
    },
    totalActiveFilters(): number {
      return this.filters.reduce(
        (previousValue, currentValue) =>
          currentValue.isActive ? ++previousValue : previousValue,
        0
      );
    },
  },
  methods: {
    it() {
      return this.$store.state.events;
    },
    initialfilters(): Filters[] {
      return this.$store.getters.getFilters;
    },
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
    amount() {
      this.filters = this.filters.map((f) => {
        const filterAmount = this.events.reduce(
          (previousValue, currentValue) => {
            if (currentValue.eventType === f.code) {
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
