<template>
  <div class="form-container">
    <div class="form-item">
      <label>组件名</label>
      <el-input v-model="name" autosize type="textarea" class="input-field"></el-input>
    </div>
    <div class="form-item">
      <label>数据库类型</label>
      <el-input v-model="type" autosize type="textarea" class="input-field"></el-input>
    </div>
    <div class="form-item">
      <label>URL</label>
      <el-input v-model="url" autosize type="textarea" class="input-field"></el-input>
    </div>
    <div class="form-item">
      <label>SQL执行语句</label>
      <el-input v-model="sqlCommand" autosize type="textarea" class="input-field"></el-input>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, clickNode } from '../../../hooks/useDrawer'

const name = ref(clickNode?.value.data.name || '')
const type = ref(clickNode?.value.data.type || '')
const url = ref(clickNode?.value.data.url || '')
const sqlCommand = ref(clickNode?.value.data.sqlCommand || '')

const { updateNode } = useVueFlow()

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    updateNode(clickNode.value.id,
      {
        data:
        {
          name: name.value,
          type: type.value,
          url: url.value,
          sqlCommand: sqlCommand.value
        }
      })
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
