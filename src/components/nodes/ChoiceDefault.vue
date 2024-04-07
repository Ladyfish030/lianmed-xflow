<template>
  <div class="component-container"
    :style="{ width: `${node.dimensions.width}px`, height: `${node.dimensions.height}px` }">
    <span class="span-text">Default</span>
    <el-divider class="divider" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  node: Object
})
</script>

<style scoped>
.component-container {
  border: 1px solid #b1b3b8;
  border-radius: 3px;
  background-color: white;
  position: relative;
}

.span-text {
  position: absolute;
    top: 10px;
    transform: translate(-50%, -50%);
    font-size: 11px;
    color: black;
    line-height: 150%;
    width: 90%;
}

.divider {
  margin-top: 20px;
}
</style>