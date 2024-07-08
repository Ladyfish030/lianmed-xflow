<!-- <template>
    <el-scrollbar>
        <div class="form-container">
            <div class="request-container">
                <div class="request-span-container">
                    <span class="request-span">请求器配置</span>
                </div>
                <div class="request-right-container">
                    <div class="scrollbar-container">
                        <el-scrollbar>
                            <div class="request-button-container" v-for="(item, index) in requestConfigList"
                                :key="index">
                                <el-button class="request-button" plain @click="showRequestConfig(item)" type="primary">
                                    <el-text class="request-text" truncated>
                                        {{ item.name }}
                                    </el-text>
                                </el-button>
                                <el-button class="delete-button" @click="removeRequestConfigHandler(item.name)">
                                    <el-icon :size="20" color="#f89898">
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="add-button-container">
                        <ChoiceAddIcon class="add-button" @click="handleBeforeAddRequestConfig" />
                    </div>
                </div>
            </div>
            <el-divider class="divider" />
            <div class="form-item">
                <label>连接配置</label>
                <el-select v-model="connectorConfiguration" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in requestConfigList" :key="index" :label="item.name"
                        :value="item.name" />
                </el-select>
            </div>
            <div class="form-item">
                <label>Method</label>
                <el-select v-model="method" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in requestMethodList" :key="index" :label="item" :value="item" />
                </el-select>
            </div>
            <div class="form-item">
                <label>Path</label>
                <el-input v-model="path" autosize type="textarea" resize="none" class="input-field"></el-input>
            </div>
            <div class="form-item">
                <label>URL</label>
                <el-input v-model="url" autosize type="textarea" resize="none" class="input-field"></el-input>
            </div>
            <div class="tabs-wrapper">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="Body" name="Body">
                        <el-scrollbar>
                            <div style="height: 120px;">
                                <el-input v-model="body" type="textarea" resize="none"
                                    :autosize="{ minRows: 5 }"></el-input>
                            </div>
                        </el-scrollbar>
                    </el-tab-pane>
                    <el-tab-pane label="Headers" name="Headers">
                        <KeyValueTable :data="headers" @edit="editHeadersHandler" @delete="deleteHeaderHandler"
                            @add="addHeaderHandler" />
                    </el-tab-pane>
                    <el-tab-pane label="Query Parameters" name="Query Parameters">
                        <KeyValueTable :data="queryParameters" @edit="editQueryParameterHandler"
                            @delete="deleteQueryParameterHandler" @add="addQueryParameterHandler" />
                    </el-tab-pane>
                    <el-tab-pane label="URL Parameters" name="URL Parameters">
                        <KeyValueTable :data="urlParameters" @edit="editUrlParameterHandler"
                            @delete="deleteUrlParameterHandler" @add="addUrlParameterHandler" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-scrollbar>

    <el-dialog v-model="RequestFormVisible" title="请求器属性" width="400" :close-on-click-modal="false">
        <el-form :model="requestConfigForm">
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="requestConfigForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="协议" :label-width="formLabelWidth">
                <el-select v-model="requestConfigForm.protocol" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in protocolTypeList" :key="index" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="主机名" :label-width="formLabelWidth">
                <el-input v-model="requestConfigForm.host" autocomplete="off" />
            </el-form-item>
            <el-form-item label="端口号" :label-width="formLabelWidth">
                <el-input v-model="requestConfigForm.port" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Base Path" :label-width="formLabelWidth">
                <el-input v-model="requestConfigForm.basePath" autocomplete="off" />
            </el-form-item>
            <el-form-item label="连接空闲超时" :label-width="formLabelWidth">
                <el-input v-model="requestConfigForm.ConnectionIdleTimeout" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="RequestFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveRequestConfig">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { isSave, saveAttributeComplete, drawerClickNode, haveEdited } from '@/hooks/useDrawer'
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

import KeyValueTable from '@/components/flow/KeyValueTable.vue'

const connectorConfiguration = ref(drawerClickNode?.value.data.connectorConfiguration || '')
const method = ref(drawerClickNode?.value.data.method || '')
const path = ref(drawerClickNode?.value.data.path || '')
const url = ref(drawerClickNode?.value.data.url || '')
const body = ref(drawerClickNode?.value.data.body || '')
const headers = ref(drawerClickNode?.value.data.headers || [])
const queryParameters = ref(drawerClickNode?.value.data.queryParameters || [])
const urlParameters = ref(drawerClickNode?.value.data.urlParameters || [])

const { updateNode } = useVueFlow()
const RequestFormVisible = ref(false)
const isAddNewRequestConfig = ref(false)
const requestConfigList = ref(getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG))
var currentRequestConfig = null
const formLabelWidth = '100px'
const requestMethodList = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const protocolTypeList = ['HTTP', 'HTTPS']
const activeName = ref('Body')
const requestConfigForm = reactive({
    name: '',
    basePath: '',
    protocol: '',
    host: '',
    port: '',
    ConnectionIdleTimeout: '',
})
const requestConfigFormInitData = {
    name: '',
    basePath: '',
    protocol: '',
    host: '',
    port: '',
    ConnectionIdleTimeout: '30000',
}

function removeRequestConfigHandler(requestConfigName) {
    ElMessageBox.confirm(
        '确定删除该监听器配置？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    )
        .then(() => {
            nodes.value.forEach((node, index) => {
                if (node.type == NodeType.REQUEST && node.data.connectorConfiguration == requestConfigName) {
                    node.data.connectorConfiguration = ''
                }
            });
            removeGlobalConfig(requestConfigName)
            requestConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG)
            if (connectorConfiguration.value == requestConfigName) {
                connectorConfiguration.value = ''
            }
            return
        })
        .catch(() => {
        })
}

function showRequestConfig(item) {
    for (let key in item) {
        if (requestConfigForm.hasOwnProperty(key)) {
            requestConfigForm[key] = item[key];
        }
    }
    currentRequestConfig = item
    isAddNewRequestConfig.value = false
    RequestFormVisible.value = true
}

function handleBeforeAddRequestConfig() {
    for (let key of Object.keys(requestConfigForm)) {
        requestConfigForm[key] = requestConfigFormInitData[key]
    }
    isAddNewRequestConfig.value = true
    RequestFormVisible.value = true
}

function saveRequestConfig() {
    const newRequestConfig = { ...requestConfigForm };
    if (newRequestConfig.name == '') {
        ElMessage({
            message: '名称不能为空',
            type: 'error',
        })
        return
    }
    if (isAddNewRequestConfig.value) {
        newRequestConfig.type = GlobalConfigTypeInGeneral.REQUEST_CONFIG
        if (insertGlobalConfig(newRequestConfig)) {
            requestConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG)
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
        RequestFormVisible.value = false
    }
    else {
        if (newRequestConfig.name == currentRequestConfig.name) {
            editGlobalConfig(currentRequestConfig, newRequestConfig)
            requestConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.LISTENER_CONFIG)
            ElMessage({
                message: '修改成功',
                type: 'success',
            })
        }
        else {
            const isExist = findGlobalConfigByName(newRequestConfig.name)
            if (isExist) {
                ElMessage({
                    message: '修改失败，名称不能重复',
                    type: 'error',
                })
                return
            }
            else {
                if (connectorConfiguration.value == currentRequestConfig.name) {
                    connectorConfiguration.value = newRequestConfig.name
                }
                nodes.value.forEach((node, index) => {
                    if (node.type == NodeType.REQUEST && node.data.connectorConfiguration == currentRequestConfig.name) {
                        node.data.connectorConfiguration = newRequestConfig.name
                    }
                });
                editGlobalConfig(currentRequestConfig, newRequestConfig)
                requestConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG)
                ElMessage({
                    message: '修改成功',
                    type: 'success',
                })
            }
        }
        RequestFormVisible.value = false
    }
}

function editHeadersHandler(newData) {
  headers.value = newData;
}

function deleteHeaderHandler(newData) {
  headers.value = newData;
}

function addHeaderHandler(newData) {
  headers.value = newData;
}

function editQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function deleteQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function addQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function editUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

function deleteUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

function addUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

watch([connectorConfiguration, method, path, url, body, headers, queryParameters, urlParameters], ([newConnectorConfigurationValue, newMethodValue, newPathValue, newUrlValue, newBodyValue, newHeadersValue, newQueryParametersValue, newUrlParametersValue], [oldConnectorConfigurationValue, oldMethodValue, oldPathValue, oldUrlValue, oldBodyValue, oldHeadersValue, oldQueryParametersValue, oldUrlParametersValue]) => {
    if (newConnectorConfigurationValue !== drawerClickNode?.value.data.connectorConfiguration ||
        newMethodValue !== drawerClickNode?.value.data.method ||
        newPathValue !== drawerClickNode?.value.data.path ||
        newUrlValue !== drawerClickNode?.value.data.url ||
        newBodyValue !== drawerClickNode?.value.data.body ||
        newHeadersValue !== drawerClickNode?.value.data.headers ||
        newQueryParametersValue !== drawerClickNode?.value.data.queryParameters ||
        newUrlParametersValue !== drawerClickNode?.value.data.urlParameters
    ) {
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
                    connectorConfiguration: connectorConfiguration.value,
                    method: method.value,
                    path: path.value,
                    url: url.value,
                    body: body.value,
                    headers: headers.value,
                    queryParameters: queryParameters.value,
                    urlParameters: urlParameters.value,
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

.request-container {
    width: 100%;
    height: 160px;
    border-radius: 5px;
    border: 1px solid #dedfe0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-top: 5px;
}

.request-span-container {
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

.request-span {
    line-height: 100%;
    -webkit-writing-mode: vertical-lr;
        -ms-writing-mode: tb-lr;
            writing-mode: vertical-lr;
    letter-spacing: 0.5em;
    margin-top: 10px;
    font-weight: bold;
}

.request-right-container {
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

.request-button-container {
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

.request-button {
    width: 95%;
    height: 30px;
    position: relative;
}

.request-button:hover {
    background-color: #c6e2ff;
}

.request-text {
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

.request-button-container:hover .delete-button {
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

.tabs-wrapper {
    height: 190px;
    border: 1px solid #dedfe0; 
    border-radius: 5px;
    padding: 5px 8px 5px 8px;
}

::v-deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 5px;
}
</style> -->





<template>
    <el-scrollbar>
        <div class="form-container">
            <div class="form-item">
                <label>连接配置</label>
                <div class="connection-container">
                    <el-select 
                        v-model="connectorConfiguration" 
                        placeholder="" 
                        :class="{'input-field': true, 'invalid-input': !isConnectorConfigValid}">
                        <el-option v-for="(item, index) in typeConfigList" :key="index" :label="item.name"
                            :value="item.name" />
                    </el-select>
                    <el-tooltip content="新增" placement="bottom" effect="dark" :hide-after="0">
                        <button class="tool-button" @click="addRequestConfigHandler()">
                            <AddIcon />
                        </button>
                    </el-tooltip>
                    <el-tooltip content="编辑" placement="bottom" effect="dark" :hide-after="0">
                        <button 
                            :class="{ 'tool-button': !disableEditButton, 'disabled-button': disableEditButton }"
                            @click="editRequestConfigHandler()"
                            :disabled="disableEditButton">
                            <el-icon>
                                <Edit />
                            </el-icon>
                        </button>
                    </el-tooltip>
                </div>
                <div v-if="connectorConfiguration && !isConnectorConfigValid" class="error-message">该配置名已被修改或不存在</div>
            </div>
            <div class="form-item">
                <label>Method</label>
                <el-select v-model="method" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in requestMethodList" :key="index" :label="item" :value="item" />
                </el-select>
            </div>
            <div class="form-item">
                <label>Path</label>
                <el-input v-model="path" autosize type="textarea" resize="none" class="input-field"></el-input>
            </div>
            <div class="form-item">
                <label>URL</label>
                <el-input v-model="url" autosize type="textarea" resize="none" class="input-field"></el-input>
            </div>
            <div class="tabs-wrapper">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="Body" name="Body">
                        <el-scrollbar>
                            <div style="height: 120px;">
                                <el-input v-model="body" type="textarea" resize="none"
                                    :autosize="{ minRows: 5 }"></el-input>
                            </div>
                        </el-scrollbar>
                    </el-tab-pane>
                    <el-tab-pane label="Headers" name="Headers">
                        <KeyValueTable :data="headers" @edit="editHeadersHandler" @delete="deleteHeaderHandler"
                            @add="addHeaderHandler" />
                    </el-tab-pane>
                    <el-tab-pane label="Query Parameters" name="Query Parameters">
                        <KeyValueTable :data="queryParameters" @edit="editQueryParameterHandler"
                            @delete="deleteQueryParameterHandler" @add="addQueryParameterHandler" />
                    </el-tab-pane>
                    <el-tab-pane label="URL Parameters" name="URL Parameters">
                        <KeyValueTable :data="urlParameters" @edit="editUrlParameterHandler"
                            @delete="deleteUrlParameterHandler" @add="addUrlParameterHandler" />
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-scrollbar>

    <RequestConfigDialog v-if="configDialogVisible"/>
</template>

<script setup>
import { ref, watch, computed, onBeforeMount } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { isSave, saveAttributeComplete, drawerClickNode, haveEdited } from '@/hooks/useDrawer'
import {
  globalConfigList,
  typeConfigList,
  configDialogVisible,
  currentConfigForm,
  temporaryConfigForm,
  isAddConfig,
  getGlobalConfigListByType
} from '@/hooks/useGlobalConfig'
import { GlobalConfigTypeInGeneral } from '@/enums/GlobalConfigTypeInGeneral'
import * as GlobalConfigForm from "@/components/global_config/attribute/GlobalConfigForm.js"

import KeyValueTable from '@/components/flow/KeyValueTable.vue'
import RequestConfigDialog from '@/components/RequestConfigDialog.vue'
import AddIcon from '@/assets/svg/AddIcon.vue'

import { getGlobalConfigByName, getAllGlobalConfig } from '@/service/GlobalConfigService'

const connectorConfiguration = ref(drawerClickNode?.value.data.connectorConfiguration || '')
const method = ref(drawerClickNode?.value.data.method || '')
const path = ref(drawerClickNode?.value.data.path || '')
const url = ref(drawerClickNode?.value.data.url || '')
const body = ref(drawerClickNode?.value.data.body || '')
const headers = ref(drawerClickNode?.value.data.headers || [])
const queryParameters = ref(drawerClickNode?.value.data.queryParameters || [])
const urlParameters = ref(drawerClickNode?.value.data.urlParameters || [])

const { updateNode } = useVueFlow()
const requestMethodList = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const activeName = ref('Body')

const isConnectorConfigValid = computed(() => {
  return typeConfigList.value.some(config => config.name === connectorConfiguration.value);
})

const disableEditButton = computed(() => {
  return !connectorConfiguration.value || (connectorConfiguration.value && !isConnectorConfigValid.value);
})

onBeforeMount(async () => {
  await getAllGlobalConfig()
    .then((res) => {
      globalConfigList.value = res.map(config => JSON.parse(config.globalJson));
      typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG)
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message: '获取全局配置错误',
      })
    })
})

function addRequestConfigHandler() {
  Object.keys(currentConfigForm).forEach(key => {
    delete currentConfigForm[key]
  })
  Object.assign(currentConfigForm, { ...GlobalConfigForm.RequestConfig })
  isAddConfig.value = true
  configDialogVisible.value = true
}

async function editRequestConfigHandler() {
  Object.keys(currentConfigForm).forEach(key => {
    delete currentConfigForm[key]
  })
  Object.keys(temporaryConfigForm).forEach(key => {
    delete temporaryConfigForm[key]
  })
  await getGlobalConfigByName(connectorConfiguration.value)
    .then((res) => {
      if (Object.keys(res).length !== 0) {
        const config = JSON.parse(res.jsonString)
        Object.assign(temporaryConfigForm, { ...config })
        Object.assign(currentConfigForm, { ...config })
      }
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message: '获取全局配置错误',
      })
    })
  isAddConfig.value = false
  configDialogVisible.value = true
}

function editHeadersHandler(newData) {
  headers.value = newData;
}

function deleteHeaderHandler(newData) {
  headers.value = newData;
}

function addHeaderHandler(newData) {
  headers.value = newData;
}

function editQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function deleteQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function addQueryParameterHandler(newData) {
  queryParameters.value = newData;
}

function editUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

function deleteUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

function addUrlParameterHandler(newData) {
  urlParameters.value = newData;
}

watch([connectorConfiguration, method, path, url, body, headers, queryParameters, urlParameters], ([newConnectorConfigurationValue, newMethodValue, newPathValue, newUrlValue, newBodyValue, newHeadersValue, newQueryParametersValue, newUrlParametersValue], [oldConnectorConfigurationValue, oldMethodValue, oldPathValue, oldUrlValue, oldBodyValue, oldHeadersValue, oldQueryParametersValue, oldUrlParametersValue]) => {
    if (newConnectorConfigurationValue !== drawerClickNode?.value.data.connectorConfiguration ||
        newMethodValue !== drawerClickNode?.value.data.method ||
        newPathValue !== drawerClickNode?.value.data.path ||
        newUrlValue !== drawerClickNode?.value.data.url ||
        newBodyValue !== drawerClickNode?.value.data.body ||
        newHeadersValue !== drawerClickNode?.value.data.headers ||
        newQueryParametersValue !== drawerClickNode?.value.data.queryParameters ||
        newUrlParametersValue !== drawerClickNode?.value.data.urlParameters
    ) {
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
                    connectorConfiguration: connectorConfiguration.value,
                    method: method.value,
                    path: path.value,
                    url: url.value,
                    body: body.value,
                    headers: headers.value,
                    queryParameters: queryParameters.value,
                    urlParameters: urlParameters.value,
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

.invalid-input {
  border-color: red !important;
}

.connection-container {
  display: flex;
  align-items: center;
}

.tool-button {
    margin-left: 5px;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    height: 20px;
    width: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}

.tool-button:hover {
    -webkit-transform: scale(1.05);
        -ms-transform: scale(1.05);
            transform: scale(1.05);
    -webkit-transition: 0.25s all ease-in-out;
    -o-transition: 0.25s all ease-in-out;
    transition: 0.25s all ease-in-out;
    cursor: pointer;
    background-color: #e9e9eb;
}

.disabled-button {
    margin-left: 5px;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    height: 20px;
    width: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    cursor: not-allowed;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.tabs-wrapper {
    height: 190px;
    border: 1px solid #dedfe0; 
    border-radius: 5px;
    padding: 5px 8px 5px 8px;
}

::v-deep(.el-tabs__item) {
    font-size: 12px;
    padding: 0 5px;
}
</style>