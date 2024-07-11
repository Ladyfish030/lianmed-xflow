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