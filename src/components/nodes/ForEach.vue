<template>
  <div class="component-container">
    <Handle :position="Position.Top" />
    <Handle :position="Position.Bottom" />
    <h4 class="span-text">For-Each</h4>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { onBeforeUnmount } from 'vue'
const props = defineProps(['nodeId'])
const emit = defineEmits(['deleteNode'])
onBeforeUnmount(() => {
  emit('deleteNode', props.nodeId)
})
</script>

<style scoped>
.component-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
}

.span-text {
  font-size: 10px;
  -webkit-box-align: center;
  -ms-flex-align: center;
}
</style>
