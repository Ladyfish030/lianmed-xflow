<template>
    <div class="button-container">
        <el-tooltip content="保存草稿" placement="bottom" effect="dark">
            <button @click="onSave"><SaveFlowIcon /></button>
        </el-tooltip>
        <el-tooltip content="载入草稿" placement="bottom" effect="dark">
            <button @click="onRestore"><LoadFlowIcon /></button>
        </el-tooltip>
        <el-tooltip content="清空草稿" placement="bottom" effect="dark">
            <button @click="onClear"><ClearFlowIcon /></button>
        </el-tooltip>
        <el-tooltip content="生成XML" placement="bottom" effect="dark">
            <button @click="generateXmlFile"><GenerateXmlFileIcon /></button>
        </el-tooltip>
    </div>
</template>
<script setup>
import { useVueFlow } from '@vue-flow/core'
import { setParentPos, getParentPos } from '../hooks/useAdsorption'
import SaveFlowIcon from '@/assets/svg/SaveFlowIcon.vue'
import LoadFlowIcon from '@/assets/svg/LoadFlowIcon.vue'
import ClearFlowIcon from '@/assets/svg/ClearFlowIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'

const flowKey = 'xFlow'
const parentPos = 'parentPos'
const { toObject, fromObject } = useVueFlow()

function onSave() {
    localStorage.setItem(flowKey, JSON.stringify(toObject()))
    localStorage.setItem(parentPos, JSON.stringify(getParentPos()))
    ElMessage({
        message: '保存成功',
        type: 'success',
    })
}

function onRestore() {
    const flow = JSON.parse(localStorage.getItem(flowKey))
    if (flow) {
        ElMessageBox.confirm('确定载入草稿？这将会覆盖当前数据')
            .then(() => {
                fromObject(flow)
                setParentPos(JSON.parse(localStorage.getItem(parentPos)) || [])
                ElMessage({
                    message: '载入草稿成功',
                    type: 'success',
                })
                return
            })
            .catch(() => {
                // catch error
            })
    } else {
        ElMessage({
            message: '草稿箱为空',
            type: 'warning',
        })
    }
}

function onClear() {
    ElMessageBox.confirm('确定清空草稿箱？')
        .then(() => {
            localStorage.clear()
            ElMessage({
                message: '清空草稿成功',
                type: 'success',
            })
            return
        })
        .catch(() => {
            // catch error
        })
}

function generateXmlFile() {
    
}
</script>

<style scoped>
.button-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: 5px;
    margin-right: auto;
    height: 100%;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    border-color: transparent;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.button-container>button {
    margin-left: 8px;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    height: 25px;
    width: 25px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.button-container>button:hover {
    -webkit-transform: scale(105%);
    -ms-transform: scale(105%);
    transform: scale(105%);
    -webkit-transition: 0.25s all ease-in-out;
    -o-transition: 0.25s all ease-in-out;
    transition: 0.25s all ease-in-out;
    cursor: pointer;
    background-color: #e9e9eb;
}
</style>