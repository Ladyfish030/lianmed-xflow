<template>
    <div class="form-container">
        <div class="listener-container">
            <div class="listener-span-container">
                <span class="listener-span">监听器配置</span>
            </div>
            <div class="listener-right-container">
                <div class="scrollbar-container">
                    <el-scrollbar>
                        <div class="listener-button-container" v-for="(item, index) in listenerConfigList" :key="index">
                            <el-button class="listener-button" plain @click="showListenerConfig(item)" type="primary">
                                <el-text class="listener-text" truncated>
                                    {{ item.name }}
                                </el-text>
                            </el-button>
                            <el-button class="delete-button" @click="removeListenerConfigHandler(item.name)">
                                <el-icon :size="20" color="#f89898">
                                    <Delete />
                                </el-icon>
                            </el-button>
                        </div>
                    </el-scrollbar>
                </div>
                <div class="add-button-container">
                    <ChoiceAddIcon class="add-button" @click="handleBeforeAddListenerConfig" />
                </div>
            </div>
        </div>
        <el-divider class="divider" />
        <div class="form-item">
            <label>连接配置</label>
            <el-select v-model="connectorConfiguration" placeholder="" class="input-field">
                <el-option v-for="(item, index) in listenerConfigList" :key="index" :label="item.name"
                    :value="item.name" />
            </el-select>
        </div>
        <div class="form-item">
            <label>path</label>
            <el-input v-model="path" autosize type="textarea" class="input-field"></el-input>
        </div>
    </div>

    <el-dialog v-model="ListenerFormVisible" title="监听器属性" width="400">
        <el-form :model="listenerConfigForm">
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="listenerConfigForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="协议" :label-width="formLabelWidth">
                <el-select v-model="listenerConfigForm.protocol" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in protocolTypeList" :key="index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="主机名" :label-width="formLabelWidth">
                <el-input v-model="listenerConfigForm.host" autocomplete="off" />
            </el-form-item>
            <el-form-item label="端口号" :label-width="formLabelWidth">
                <el-input v-model="listenerConfigForm.port" autocomplete="off" />
            </el-form-item>
            <el-form-item label="base path" :label-width="formLabelWidth">
                <el-input v-model="listenerConfigForm.basePath" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="ListenerFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveListenerConfig">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { isSave, saveAttributeComplete, drawerClickNode } from '@/hooks/useDrawer'
import {
    findGlobalConfigByName,
    getGlobalConfigListByType,
    editGlobalConfig,
    insertGlobalConfig,
    removeGlobalConfig,
} from '@/hooks/useGlobalConfig'
import { nodes } from '@/hooks/useNode'

import { NodeType } from '@/enums/NodeType'
import { GlobalConfigTypeInGeneral } from '@/enums/GlobalConfigTypeInGeneral'

import ChoiceAddIcon from '@/assets/svg/ChoiceAddIcon.vue'

const connectorConfiguration = ref(drawerClickNode?.value.data.connectorConfiguration || '')
const path = ref(drawerClickNode?.value.data.path || '')

const { updateNode } = useVueFlow()
const ListenerFormVisible = ref(false)
const isAddNewListenerConfig = ref(false)
const listenerConfigList = ref(getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG))
var currentListenerConfig = null
const formLabelWidth = '90px'
const protocolTypeList = ['HTTP', 'HTTPS']
const listenerConfigForm = reactive({
    name: '',
    protocol: '',
    host: '',
    port: '',
    basePath: '',
})

function removeListenerConfigHandler(listenerConfigName) {
    ElMessageBox.confirm(
        '确定删除该监听器配置？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(() => {
            nodes.value.forEach((node, index) => {
                if (node.type == NodeType.LISTENER && node.data.connectorConfiguration == listenerConfigName) {
                    node.data.connectorConfiguration = ''
                }
            });
            removeGlobalConfig(listenerConfigName)
            listenerConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG)
            if (connectorConfiguration.value == listenerConfigName) {
                connectorConfiguration.value = ''
            }
            return
        })
        .catch(() => {
        })
}

function showListenerConfig(item) {
    for (let key in item) {
        if (listenerConfigForm.hasOwnProperty(key)) {
            listenerConfigForm[key] = item[key];
        }
    }
    currentListenerConfig = item
    isAddNewListenerConfig.value = false
    ListenerFormVisible.value = true
}

function handleBeforeAddListenerConfig() {
    for (let key of Object.keys(listenerConfigForm)) {
        listenerConfigForm[key] = '';
    }
    isAddNewListenerConfig.value = true
    ListenerFormVisible.value = true
}

function saveListenerConfig() {
    const newListenerConfig = { ...listenerConfigForm };
    if (newListenerConfig.name == '') {
        ElMessage({
            message: '名称不能为空',
            type: 'error',
        })
        return
    }
    if (isAddNewListenerConfig.value) {
        newListenerConfig.type = GlobalConfigTypeInGeneral.LISTENER_CONFIG
        if (insertGlobalConfig(newListenerConfig)) {
            listenerConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG)
            ElMessage({
                message: '保存成功',
                type: 'success',
            })
        }
        else {
            ElMessage({
                message: '保存失败，名称不能重复',
                type: 'error',
            })
            return
        }
        ListenerFormVisible.value = false
    }
    else {
        if (newListenerConfig.name == currentListenerConfig.name) {
            editGlobalConfig(currentListenerConfig, newListenerConfig)
            listenerConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG)
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        }
        else {
            const isExist = findGlobalConfigByName(newListenerConfig.name)
            if (isExist) {
                ElMessage({
                    message: '修改失败，名称不能重复',
                    type: 'error',
                })
                return
            }
            else {
                if (connectorConfiguration.value == currentListenerConfig.name) {
                    connectorConfiguration.value = newListenerConfig.name
                }
                nodes.value.forEach((node, index) => {
                    if (node.type == NodeType.LISTENER && node.data.connectorConfiguration == currentListenerConfig.name) {
                        node.data.connectorConfiguration = newListenerConfig.name
                    }
                });
                editGlobalConfig(currentListenerConfig, newListenerConfig)
                listenerConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG)
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
            }
        }
        ListenerFormVisible.value = false
    }
}

watch(isSave, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        updateNode(drawerClickNode.value.id,
            {
                data:
                {
                    displayName: drawerClickNode?.value.data.displayName,
                    connectorConfiguration: connectorConfiguration.value,
                    path: path.value,
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

.listener-container {
    width: 100%;
    height: 160px;
    border-radius: 5px;
    border: 1px solid #dedfe0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-top: 5px;
}

.listener-span-container {
    width: 15%;
    height: 100%;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.listener-span {
    line-height: 100%;
    -webkit-writing-mode: vertical-lr;
        -ms-writing-mode: tb-lr;
            writing-mode: vertical-lr;
    letter-spacing: 0.5em;
    margin-top: 10px;
    font-weight: bold;
}

.listener-right-container {
    width: 85%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
}

.scrollbar-container {
    margin-top: 10px;
    width: 100%;
    height: 110px;
}

.listener-button-container {
    width: 100%;
    height: 30px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin: 6px 0px 6px 0px;
}

.listener-button {
    width: 95%;
    height: 30px;
    position: relative;
}

.listener-button:hover {
    background-color: #c6e2ff;
}

.listener-text {
    position: absolute;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 80%;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}

.delete-button {
    display: none;
    width: 20px;
    height: 30px;
    border-width: 0px;
    margin-left: 5px;
    margin-right: 15px;
}

.delete-button:hover {
    background-color: #fef0f0;
}

.listener-button-container:hover .delete-button {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.add-button-container {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 95%;
    height: 40px;
}

.add-button {
    cursor: pointer;
    border-color: #b1b3b8;
}

.divider {
    margin: 0px;
    width: 100%;
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