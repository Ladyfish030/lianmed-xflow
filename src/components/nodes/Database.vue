<!-- <template>
  <el-popover 
    placement="right"
    ref="popover" 
    trigger="contextmenu"
    :width="100"
  >
    <FlowNodeMenu />
    <template #reference>
      <div class="component-container" :style="{ opacity: isDragged ? '0.5' : '1' }">
        <Handle type="target" :position="Position.Left" />
        <Handle type="source" :position="Position.Right" />
        <div class="content">
          <DatabaseIcon />
          <span class="span-text">Database</span>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import { clickedNode } from '@/hooks/useMenu'
import DatabaseIcon from '@/assets/svg/DatabaseIcon.vue'
import FlowNodeMenu from '@/components/FlowNodeMenu.vue'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
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

onBeforeMount(() => {
  console.log("database渲染:")
})

onBeforeUnmount(() => {
  console.log("database销毁:")
})
</script>

<style scoped>
.component-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  background-color: white;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.span-text {
  margin-top: 10px;
  font-size: 11px;
  line-height: 100%;
}
</style> -->

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
import { ref, watch, onBeforeMount, onBeforeUnmount, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import DatabaseIcon from '@/assets/svg/DatabaseIcon.vue'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
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

onBeforeMount(() => {
  console.log("database渲染:")
})

onBeforeUnmount(() => {
  console.log("database销毁:")
})
</script>

<style scoped>
.component-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  background-color: white;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.span-text {
  margin-top: 10px;
  font-size: 11px;
  line-height: 100%;
}
</style>