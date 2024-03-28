<template>
  <div class="form-container">
    <div class="form-item">
      <label>Path</label>
      <el-input v-model="path" autosize type="textarea" class="input-field"></el-input>
    </div>
    <div class="form-item">
      <label>方法</label>
      <el-input v-model="method" autosize type="textarea" class="input-field"></el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { isSave, saveAttributeComplete, findClickedNode } from '../../../hooks/useDrawer'

const clickedNode = findClickedNode()
const path = ref(clickedNode?.data.path || '')
const method = ref(clickedNode?.data.method || '')

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    const clickedNode = findClickedNode()

    if (clickedNode) {
      clickedNode.data.path = path.value
      clickedNode.data.method = method.value
    }
    saveAttributeComplete()
  }
})
</script>

<style scoped>
.form-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.form-item label {
  font-size: 15px;
}

.input-field {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>