<template>
  <div class="component-container" :style="{ width: `${node.dimensions.width}px`, height: `${node.dimensions.height}px` }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <ChoiceIcon />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import ChoiceIcon from '@/assets/svg/ChoiceIcon.vue'
import { defineProps } from 'vue'

const props = defineProps({
    node: Object
})
</script>

<style scoped>
.component-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  background-color: #ecf5ff
}
</style>
