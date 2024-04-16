<template>
  <div
    class="component-container"
    :style="{ opacity: isDragged ? '0.5' : '1' }"
  >
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <ChoiceIcon />
    <el-button class="add-button" @click="addWhenNode">+</el-button>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, getCurrentInstance, defineProps } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import ChoiceIcon from '@/assets/svg/ChoiceIcon.vue'
import emitter from '@/utils/emitter'
const props = defineProps(['id'])
const instance = getCurrentInstance()
const nodeId = instance.attrs.id
const isDragged = ref(false)
const { isDragging, draggedId } = useDragAndDrop()

const visible = ref(false)

watch(menuClickNode, (newValue, oldValue) => {
  if (newValue.id === nodeId) {
    visible.value = true
  } else {
    visible.value = false
  }
})

watch(isDragging, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    if (draggedId.value === nodeId) {
      isDragged.value = true
    }
  } else {
    isDragged.value = false
  }
})

function addWhenNode() {
  emitter.emit('addWhenNode', props.id)
}
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
  position: relative;
}

.component-container:hover {
  background-color: #d9ecff;
}
.add-button {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
