<template>
  <el-scrollbar>
    <div class="form-container">
      <div class="form-item">
        <label>名称</label>
        <el-input v-model="displayName" autosize type="textarea" class="input-field"></el-input>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { nodes } from '@/hooks/useNode'
import { isSave, saveAttributeComplete, drawerClickNode, haveEdited } from '@/hooks/useDrawer'
import { findFlow, editFlow } from '@/hooks/useNodeOfFlow'
import { NodeType } from '@/enums/NodeType'

const displayName = ref(drawerClickNode?.value.data.displayName || '')

const { updateNode } = useVueFlow()

watch(displayName, (newValue, oldValue) => {
  if (newValue !== drawerClickNode?.value.data.displayName) {
    haveEdited.value = true
  }
  else {
    haveEdited.value = false
  }
})

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    if (displayName.value == '') {
      ElMessage({
        message: '名称不能为空',
        type: 'error',
      })
      isSave.value = false
      return
    }
    else if (drawerClickNode.value.data.displayName !== displayName.value
        && findFlow(displayName.value) !== -1) {
      ElMessage({
        message: '保存失败，名称不能重复',
        type: 'error',
      })
      isSave.value = false
      return
    }
    else {
      nodes.value.forEach((node, index) => {
          if (node.type == NodeType.FLOWREFERENCE && node.data.flowName == drawerClickNode.value.data.displayName) {
            node.data.flowName = displayName.value
          }
        });
      editFlow(drawerClickNode.value.data.displayName, displayName.value)
      updateNode(drawerClickNode.value.id,
      {
        data:
        {
          displayName: displayName.value,
        }
      })
      saveAttributeComplete()
    }
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