<template>
    <div class="component-container">
        <el-text class="span-text" truncated>
            {{ expression }}
        </el-text>
        <el-divider class="divider" />
    </div>
</template>

<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { findNodeById } from '../../hooks/useNode'
import { saveComplete, drawerClickNode } from '../../hooks/useDrawer'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id
const node = findNodeById(nodeId)
const expression = ref(node?.data.expression || 'When')

watch(saveComplete, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
      if (drawerClickNode.value.id === nodeId) {
        expression.value = findNodeById(nodeId).data.expression
    }
  }
})
</script>

<style scoped>
.component-container {
    border: 1px solid #b1b3b8;
    border-radius: 3px;
    background-color: white;
    position: relative;
    height: 100%;
}

.component-container:hover {
  background-color: #f4f4f5;
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
