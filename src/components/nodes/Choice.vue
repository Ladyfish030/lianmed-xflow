<template>
  <el-popover 
    placement="right"
    ref="popover" 
    trigger="contextmenu"
    :width="100"
    :visible="visible"
  >
    <FlowNodeMenu />
    <template #reference>
      <div class="component-container" :style="{ opacity: isDragged ? '0.5' : '1' }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <ChoiceIcon />
  </div>
    </template>
  </el-popover>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import { menuClickNode } from '@/hooks/useMenu'
import ChoiceIcon from '@/assets/svg/ChoiceIcon.vue'
import FlowNodeMenu from '@/components/FlowNodeMenu.vue'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
const isDragged = ref(false)
const { isDragging, draggedId } = useDragAndDrop()

const visible = ref(false)

watch(menuClickNode, (newValue, oldValue) => {
  if (newValue.id === nodeId) {
    visible.value = true
  }
  else {
    visible.value = false
  }
})

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
  background-color: #ecf5ff;
  height: 100%;
}

.component-container:hover {
  background-color: #d9ecff;
}
</style>
