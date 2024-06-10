<template>
  <div
    class="component-container"
    :style="{ opacity: isDragged ? '0.5' : '1' }"
  >
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <ChoiceIcon />
    <ChoiceAddIcon class="add-button" @click="addWhenNode" />
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, getCurrentInstance, defineProps } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import ChoiceIcon from '@/assets/svg/ChoiceIcon.vue'
import ChoiceAddIcon from '@/assets/svg/ChoiceAddIcon.vue'
import emitter from '@/utils/emitter'

const props = defineProps(['id'])
const instance = getCurrentInstance()
const nodeId = instance.props.id
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
  background-color: white;
  height: 100%;
  position: relative;
}

.component-container:hover {
  background-color: #f4f4f5;
}

.add-button {
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  border-color: #b1b3b8;
}
</style>
