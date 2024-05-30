<template>
    <div class="component-container" :style="{ opacity: isDragged ? '0.5' : '1' }">
        <el-text class="span-text" truncated>
            {{ displayName }}
        </el-text>
        <el-divider class="divider" />
    </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import useDragAndDrop from '@/hooks/useDnD'
import { findNodeById } from '../../hooks/useNode'
import { saveComplete, drawerClickNode } from '../../hooks/useDrawer'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
const node = findNodeById(nodeId)
const displayName = ref(node?.data.displayName)
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

watch(saveComplete, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        if (drawerClickNode.value.id === nodeId) {
            displayName.value = findNodeById(nodeId).data.displayName
        }
    }
})
</script>

<style scoped>
.component-container {
    position: relative;
    border: 1px solid #b1b3b8;
    border-radius: 3px;
    background-color: white;
    height: 100%;
}

.component-container:hover {
    background-color: #f4f4f5;
}

.span-text {
    position: absolute;
    top: 2px;
    left: 10px;
    font-size: 11px;
    color: black;
    line-height: 150%;
    width: 90%;
    text-align: left;
}

.divider {
    margin-top: 20px;
}
</style>