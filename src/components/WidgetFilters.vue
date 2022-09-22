<template>
  <div class="filters-list">
    <!--
      Кнопки фильтров
      При нажатии посылает в родительский компонент объект со свойствами выбранного фильтра
    -->
    <div
      @click="$emit('filtered', filter)"
      class="filter-item"
      :class="{
        active: filter.isActive,
        /**
         * Нельзя изменить состояние фильтра при следующих условиях:
         * - общее количество предупреждений для данного фильтра равно нулю
         * или
         * - применен только один данный фильтр
         */
        disable:
          filter.amount === 0 || (totalActiveFilters <= 1 && filter.isActive),
      }"
      v-for="filter in filters"
      :key="`fw-${filter.code}`"
    >
      <div>{{ filter.name }}</div>
      <span class="filter-count">{{ filter.amount }}</span>
      <div class="filter-icon-block">
        <div
          class="filter-icon-open"
          v-if="!filter.isActive || filter.amount === 0"
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="#C4C4C4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.5 4.5L3.5 8H4.5L4.5 4.5H8L8 3.5L4.5 3.5L4.5 0L3.5 0L3.5 3.5L0 3.5L0 4.5L3.5 4.5Z"
            />
          </svg>
        </div>
        <div class="filter-icon-close" v-else>
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="#C4C4C4"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.07115 4.7784L7.25309 7.96033L7.9602 7.25323L4.77826 4.07129L7.9602 0.88935L7.25309 0.182244L4.07115 3.36418L0.889129 0.18216L0.182022 0.889267L3.36404 4.07129L0.182022 7.25331L0.889129 7.96042L4.07115 4.7784Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <!--
      Кнопка 'Показать все'
    -->
    <div
      @click="$emit('filtered', 100)"
      class="show-all"
      :class="{
        /**
         *  Кнопка 'Показать все' активна если количество примененных фильтров меньше трех.
         */
        disable: totalActiveFilters === 3,
      }"
    >
      Показать все
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Filters } from "@/types/types";

export default defineComponent({
  props: {
    /**
     * Массив объектов, которые определяют состояние фильтра и его отображение.
     */
    filters: {
      type: Array as PropType<Filters[]>,
      required: true,
    },
    /**
     * totalActiveFilters - Общее количество примененных фильтров
     */
    totalActiveFilters: {
      type: Number,
      required: true,
    },
  },
  emits: ["filtered", "remove"],
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/style.scss";
.filters-list {
  display: flex;
  flex-wrap: wrap;
  margin: 18px 12px 0 14px;
  gap: 10px 10px;

  .show-all {
    color: $color-filter-font-shadow;
    font-weight: 400;
    font-size: 12px;
    line-height: 12px;
    margin: auto 0;
    padding: 6px 8px 6px 14px;
    cursor: pointer;

    &.disable {
      pointer-events: none;
      cursor: none;
      color: $color-filter-font-disabled;
    }

    &:hover {
      text-decoration-line: underline;
    }

    &:active {
      color: #1f54b7;
    }
  }
}
.filter-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 8px 6px 14px;
  gap: 3px;
  border-radius: 20px;
  border: 1px solid $color-filters-day-dark;
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  color: $color-filter-font-default;
  cursor: pointer;

  &.disable {
    pointer-events: none;
    cursor: none;
  }
  .filter-count {
    opacity: 70%;
  }

  &:hover {
    color: $color-filter-font-default-hover;
    border: 1px solid $color-filter-font-shadow;

    .filter-icon-open svg {
      fill: $color-filter-font-default-hover;
    }
  }
  &:active {
    box-shadow: 0px 0px 4px $color-filter-font-shadow;
  }
}
.filter-item.active {
  background-color: $color-filters-day-dark;
  color: $color-filters-day-darker;
  // border: none;

  &:hover {
    background: #eaeef2;
    border: 1px solid $color-filters-day-dark;

    .filter-icon-close svg {
      fill: $color-filters-day-darker;
    }
  }

  &:active {
    box-shadow: 0px 0px 4px $color-filter-font-shadow;
  }
}
</style>
