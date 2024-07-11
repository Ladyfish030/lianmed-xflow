<template>
  <el-scrollbar>
    <div class="form-container">
      <div class="form-item">
        <label>操作</label>
        <el-select v-model="operation" placeholder="" class="input-field">
          <el-option v-for="(item, index) in databaseOperationList" :key="index" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="form-item">
        <label>连接配置</label>
        <div class="connection-container">
          <el-select v-model="connectorConfiguration" placeholder=""
            :class="{'input-field': true, 'invalid-input': !isConnectorConfigValid}">
            <el-option v-for="(item, index) in typeConfigList" :key="index" :label="item.name" :value="item.name" />
          </el-select>
          <el-tooltip content="新增" placement="bottom" effect="dark" :hide-after="0">
            <button class="tool-button" @click="addDatabaseConfigHandler()">
              <AddIcon />
            </button>
          </el-tooltip>
          <el-tooltip content="编辑" placement="bottom" effect="dark" :hide-after="0">
            <button 
              :class="{ 'tool-button': !disableEditButton, 'disabled-button': disableEditButton }"
              @click="editDatabaseConfigHandler()" 
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
        <label>SQL执行语句</label>
        <el-input v-model="sqlCommand" autosize type="textarea" resize="none" class="input-field"></el-input>
      </div>
      <div class="form-item">
        <label>输入参数</label>
        <el-input v-model="inputParameters" autosize type="textarea" resize="none" class="input-field"></el-input>
      </div>
    </div>
  </el-scrollbar>

  <DatabaseConfigDialog v-if="configDialogVisible" />
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue'
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
import DatabaseConfigDialog from '@/components/DatabaseConfigDialog.vue'
import AddIcon from '@/assets/svg/AddIcon.vue'

import { getGlobalConfigByName, getAllGlobalConfig } from '@/service/GlobalConfigService'

const operation = ref(drawerClickNode?.value.data.operation || '')
const connectorConfiguration = ref(drawerClickNode?.value.data.connectorConfiguration || '')
const sqlCommand = ref(drawerClickNode?.value.data.sqlCommand || '')
const inputParameters = ref(drawerClickNode?.value.data.inputParameters || '')

const { updateNode } = useVueFlow()

const databaseOperationList = ['Select', 'Insert', 'Delete', 'Update']

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
      typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG)
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message: '获取全局配置错误',
      })
    })
})

function addDatabaseConfigHandler() {
  Object.keys(currentConfigForm).forEach(key => {
    delete currentConfigForm[key]
  })
  Object.assign(currentConfigForm, { ...GlobalConfigForm.MySqlConfig })
  isAddConfig.value = true
  configDialogVisible.value = true
}

async function editDatabaseConfigHandler() {
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

watch([operation, connectorConfiguration, sqlCommand, inputParameters], ([newOperationValue, newConnectorConfigurationValue, newSqlCommandValue, newInputParametersValue], [oldOperationValue, oldConnectorConfigurationValue, oldSqlCommandValue, oldInputParametersValue]) => {
  if (newOperationValue !== drawerClickNode?.value.data.operation ||
    newConnectorConfigurationValue !== drawerClickNode?.value.data.connectorConfiguration ||
    newSqlCommandValue !== drawerClickNode?.value.data.sqlCommand ||
    newInputParametersValue !== drawerClickNode?.value.data.inputParameters
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
          operation: operation.value,
          connectorConfiguration: connectorConfiguration.value,
          sqlCommand: sqlCommand.value,
          inputParameters: inputParameters.value,
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
</style>
