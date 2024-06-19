<template>
    <div class="form-container">
        <div class="form-item">
            <label>表达式</label>
            <el-input v-model="expression" autosize type="textarea" class="input-field"></el-input>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode, haveEdited } from '@/hooks/useDrawer'

const expression = ref(drawerClickNode?.value.data.expression || '')

const { updateNode } = useVueFlow()

watch(expression, (newValue, oldValue) => {
  if (newValue !== drawerClickNode?.value.data.expression) {
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
          expression: expression.value,
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