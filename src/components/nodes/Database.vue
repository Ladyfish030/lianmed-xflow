<template>
  <div class="component-container" :style="{ opacity: isDragged ? '0.5' : '1' }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <div class="content">
      <DatabaseIcon />
      <span class="span-text">Database</span>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
// import { saveComplete, drawerClickNode } from '../../hooks/useDrawer'
// import { findNodeById } from '../../hooks/useNode'
import DatabaseIcon from '@/assets/svg/DatabaseIcon.vue'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
// const node = findNodeById(nodeId)
// const displayName = ref(node?.data.displayName || 'Database')
const isDragged = ref(false)
const { isDragging, draggedId } = useDragAndDrop()

watch(isDragging, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    if (draggedId.value === nodeId) {
      isDragged.value = true
    }
  }
  else {
    isDragged.value = false
  }
})

// watch(saveComplete, (newValue, oldValue) => {
//   if (oldValue === false && newValue === true) {
//     if (drawerClickNode.value.id === nodeId) {
//       const name = findNodeById(nodeId).data.displayName
//       displayName.value = name == '' ? 'Database' : name
//     }
//   }
// })
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

.content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.span-text {
  margin-top: 10px;
  font-size: 11px;
  line-height: 100%;
}
</style>