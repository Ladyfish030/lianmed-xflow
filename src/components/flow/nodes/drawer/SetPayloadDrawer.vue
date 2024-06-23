<template>
  <el-scrollbar>
    <div class="form-container">
      <div class="form-item">
        <label>Value</label>
        <el-input v-model="payloadValue" autosize type="textarea" resize="none" class="input-field"></el-input>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode, haveEdited } from '@/hooks/useDrawer'

const payloadValue = ref(drawerClickNode?.value.data.payloadValue || '')

const { updateNode } = useVueFlow()

watch(payloadValue, (newValue, oldValue) => {
  if (newValue !== drawerClickNode?.value.data.payloadValue) {
    haveEdited.value = true
  }
  else {
    haveEdited.value = false
  }
})

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    updateNode(drawerClickNode.value.id,
      {
        data:
        {
          displayName: drawerClickNode?.value.data.displayName,
          payloadValue: payloadValue.value,
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
    width: 95%;
    margin-left: 2%;
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