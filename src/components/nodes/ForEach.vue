<template>
  <div class="component-container" :style="{ opacity: isDragged ? '0.5' : '1' }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <ForEachIcon />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import ForEachIcon from '@/assets/svg/ForEachIcon.vue'
import { ref, watch, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
const isDragged = ref(false)
const { isDragging, draggedId } = useDragAndDrop()

watch(isDragging, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    if (draggedId.value === nodeId) {
      isDragged.value = true
    }
  } else {
    isDragged.value = false
  }
})
</script>

<style scoped>
.component-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  background-color: white;
  height: 100%;
}

.component-container:hover {
  background-color: #f4f4f5;
}
</style>
