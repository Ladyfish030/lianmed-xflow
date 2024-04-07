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
import { isSave, saveAttributeComplete, findClickedNode } from '../../../hooks/useDrawer'

const clickedNode = findClickedNode()
const expression = ref(clickedNode?.data.expression || '')

watch(isSave, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        const clickedNode = findClickedNode()

        if (clickedNode) {
            clickedNode.data.expression = expression.value
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