<template>
  <div class="form-container">
    <div class="form-item">
      <label>Flow Name</label>
      <el-select v-model="flowName" placeholder="" class="input-field">
        <el-option v-for="(item, index) in subFlowList" :key="index" :label="item" :value="item" />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode } from '../../../hooks/useDrawer'
import { subFlowList } from '../../../hooks/useSubFlow'

const flowName = ref(drawerClickNode?.value.data.flowName || '')

const { updateNode } = useVueFlow()

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    updateNode(drawerClickNode.value.id,
      {
        data:
        {
          displayName: drawerClickNode?.value.data.displayName,
          flowName: flowName.value,
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