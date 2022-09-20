<template>
  <div class="app">
    <WidgetMain />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WidgetMain from "@/components/WidgetMain.vue";

export default defineComponent({
  components: {
    WidgetMain,
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/style.scss";
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  /** styling scrollbar component*/

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    border: 4px solid #cfd6e4;
  }
}
*::-webkit-scrollbar {
  width: 4px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #cfd6e4;
}

html,
body,
body > div {
  height: 100%;
}

.app {
  padding: 20px;
}
</style>
