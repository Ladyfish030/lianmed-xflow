<template>
    <div class="form-container">
        <div class="form-item">
            <label>消息</label>
            <el-input v-model="message" autosize type="textarea" class="input-field"></el-input>
        </div>
        <div class="form-item">
            <label>等级</label>
            <el-select v-model="level" placeholder="" class="input-field">
                <el-option v-for="(item, index) in levelList" :key="index" :label="item" :value="item" />
            </el-select>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode } from '@/hooks/useDrawer'

const message = ref(drawerClickNode?.value.data.message || '')
const level = ref(drawerClickNode?.value.data.level || '')

const levelList = ['INFO', 'WARN', 'ERROR']
const { updateNode } = useVueFlow()

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    updateNode(drawerClickNode.value.id,
      {
        data:
        {
            displayName: drawerClickNode?.value.data.displayName,
            message: message.value,
            level: level.value
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