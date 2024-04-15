<template>
    <div class="form-container">
        <div class="form-item">
            <label>名称</label>
            <el-input v-model="name" autosize type="textarea" class="input-field"></el-input>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode } from '../../../hooks/useDrawer'

const name = ref(drawerClickNode?.value.data.name || '')

const { updateNode } = useVueFlow()

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    updateNode(drawerClickNode.value.id,
      {
        data:
        {
          name: name.value,
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