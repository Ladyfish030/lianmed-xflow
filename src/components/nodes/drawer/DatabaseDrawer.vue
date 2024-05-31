<template>
  <div class="form-container">
    <div class="database-container">
      <div class="database-span-container">
        <span class="database-span">数据库配置</span>
      </div>
      <div class="database-right-container">
        <div class="scrollbar-container">
          <el-scrollbar>
            <div class="database-button-container" v-for="(item, index) in databaseConfigList" :key="index">
              <el-button class="database-button" plain @click="showDatabaseConfig(item)" type="primary">
                <el-text class="database-text" truncated>
                  {{ item.name }}
                </el-text>
              </el-button>
              <el-button class="delete-button" @click="removeDatabaseConfigHandler(item.name)">
                <el-icon :size="20" color="#f89898">
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </el-scrollbar>
        </div>
        <div class="add-button-container">
          <ChoiceAddIcon class="add-button" @click="handleBeforeAddDatabaseConfig" />
        </div>
      </div>
    </div>
    <el-divider class="divider" />
    <div class="form-item">
      <label>操作</label>
      <el-select v-model="operation" placeholder="" class="input-field">
        <el-option v-for="(item, index) in databaseOperationList" :key="index" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="form-item">
      <label>数据库连接</label>
      <el-select v-model="connectorConfiguration" placeholder="" class="input-field">
        <el-option v-for="(item, index) in databaseConfigList" :key="index" :label="item.name" :value="item.name" />
      </el-select>
    </div>
    <div class="form-item">
      <label>SQL执行语句</label>
      <el-input v-model="sqlCommand" autosize type="textarea" class="input-field"></el-input>
    </div>
    <div class="form-item">
      <label>输入参数</label>
      <el-input v-model="inputParameters" autosize type="textarea" class="input-field"></el-input>
    </div>
  </div>

  <el-dialog v-model="databaseFormVisible" title="数据库属性" width="400">
    <el-form :model="databaseConfigForm">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="databaseConfigForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="数据库类型" :label-width="formLabelWidth">
        <el-select v-model="databaseConfigForm.connection" placeholder="" class="input-field">
          <el-option v-for="(item, index) in databaseConnectionTypeList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <div v-if="databaseConfigForm.connection === DatabaseConnectionType.MYSQL_CONNECTION">
        <el-form-item label="主机名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.host" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口号" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.port" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" show-password v-model="databaseConfigForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.database" autocomplete="off" />
        </el-form-item>
        <el-form-item label="驱动" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.driver" autocomplete="off" />
        </el-form-item>
      </div>

      <div v-if="databaseConfigForm.connection === DatabaseConnectionType.SQLSERVER_CONNECTION">
        <el-form-item label="主机名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.host" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口号" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.port" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" show-password v-model="databaseConfigForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="实例名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.instanceName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.database" autocomplete="off" />
        </el-form-item>
        <el-form-item label="驱动" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.driver" autocomplete="off" />
        </el-form-item>
      </div>

      <div v-if="databaseConfigForm.connection === DatabaseConnectionType.ORACLE_CONNECTION">
        <el-form-item label="主机名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.host" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口号" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.port" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" show-password v-model="databaseConfigForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="实例名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.instanceName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="服务名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.serviceName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="驱动" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.driver" autocomplete="off" />
        </el-form-item>
      </div>

      <div v-if="databaseConfigForm.connection === DatabaseConnectionType.POSTGRESQL_CONNECTION">
        <el-form-item label="主机名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.host" autocomplete="off" />
        </el-form-item>
        <el-form-item label="端口号" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.port" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input type="password" show-password v-model="databaseConfigForm.password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.database" autocomplete="off" />
        </el-form-item>
        <el-form-item label="驱动" :label-width="formLabelWidth">
          <el-input v-model="databaseConfigForm.driver" autocomplete="off" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="databaseFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDatabaseConfig">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { isSave, saveAttributeComplete, drawerClickNode } from '../../../hooks/useDrawer'
import {
  findGlobalConfigByName,
  getGlobalConfigListByType,
  editGlobalConfig,
  insertGlobalConfig,
  removeGlobalConfig,
} from '../../../hooks/useGlobalConfig'
import { nodes } from '@/hooks/useNode'

import { NodeType } from '@/enums/NodeType'
import { GlobalConfigTypeInGeneral } from '@/enums/GlobalConfigTypeInGeneral'
import { DatabaseConnectionType } from '../attribute/DatabaseConnectionType'

import ChoiceAddIcon from '@/assets/svg/ChoiceAddIcon.vue'

const operation = ref(drawerClickNode?.value.data.operation || '')
const connectorConfiguration = ref(drawerClickNode?.value.data.connectorConfiguration || '')
const sqlCommand = ref(drawerClickNode?.value.data.sqlCommand || '')
const inputParameters = ref(drawerClickNode?.value.data.inputParameters || '')

const { updateNode } = useVueFlow()
const databaseFormVisible = ref(false)
const isAddNewDatabaseConfig = ref(false)
var isAddNewDatabaseCauseConnectionToggle = false
var currentDatabaseConfig = null

const formLabelWidth = '90px'
const databaseConfigList = ref(getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG))
const databaseOperationList = ['Select', 'Insert', 'Delete', 'Update']
const databaseConnectionTypeList = computed(() => {
  const types = [];
  for (const key in DatabaseConnectionType) {
    if (Object.prototype.hasOwnProperty.call(DatabaseConnectionType, key)) {
      types.push(DatabaseConnectionType[key]);
    }
  }
  return types;
})

const mySqlConfig = {
  name: '',
  connection: DatabaseConnectionType.MYSQL_CONNECTION,
  host: '',
  port: '',
  username: '',
  password: '',
  database: '',
  driver: '',
}

const sqlServerConfig = {
  name: '',
  connection: DatabaseConnectionType.SQLSERVER_CONNECTION,
  host: '',
  port: '',
  username: '',
  password: '',
  instanceName: '',
  database: '',
  driver: '',
}

const oracleConfig = {
  name: '',
  connection: DatabaseConnectionType.ORACLE_CONNECTION,
  host: '',
  port: '',
  username: '',
  password: '',
  instanceName: '',
  serviceName: '',
  driver: '',
}

const postgreSqlConfig = {
  name: '',
  connection: DatabaseConnectionType.POSTGRESQL_CONNECTION,
  host: '',
  port: '',
  username: '',
  password: '',
  database: '',
  driver: '',
}

var databaseConfigForm = reactive(Object.assign({}, mySqlConfig))

watch(() => databaseConfigForm.connection, (newValue, oldValue) => {
  if (isAddNewDatabaseCauseConnectionToggle) {
    isAddNewDatabaseCauseConnectionToggle = false
    return
  }
  switch (newValue) {
    case DatabaseConnectionType.MYSQL_CONNECTION:
      Object.assign(databaseConfigForm, { ...mySqlConfig, name: databaseConfigForm.name })
      break
    case DatabaseConnectionType.SQLSERVER_CONNECTION:
      Object.assign(databaseConfigForm, { ...sqlServerConfig, name: databaseConfigForm.name })
      break
    case DatabaseConnectionType.ORACLE_CONNECTION:
      Object.assign(databaseConfigForm, { ...oracleConfig, name: databaseConfigForm.name })
      break
    case DatabaseConnectionType.POSTGRESQL_CONNECTION:
      Object.assign(databaseConfigForm, { ...postgreSqlConfig, name: databaseConfigForm.name })
      break
    default:
      return
  }
})

function removeDatabaseConfigHandler(databaseConfigName) {
  ElMessageBox.confirm(
    '确定删除该数据库配置？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      nodes.value.forEach((node, index) => {
        if (node.type == NodeType.DATABASE && node.data.connectorConfiguration == databaseConfigName) {
          node.data.connectorConfiguration = ''
        }
      });
      removeGlobalConfig(databaseConfigName)
      databaseConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG)
      if (connectorConfiguration.value == databaseConfigName) {
        connectorConfiguration.value = ''
      }
      return
    })
    .catch(() => {
    })
}

function showDatabaseConfig(item) {
  if (currentDatabaseConfig == null || item.connection != currentDatabaseConfig.connection) {
    isAddNewDatabaseCauseConnectionToggle = true
  }
  switch (item.connection) {
    case DatabaseConnectionType.MYSQL_CONNECTION:
      Object.assign(databaseConfigForm, mySqlConfig)
      break
    case DatabaseConnectionType.SQLSERVER_CONNECTION:
      Object.assign(databaseConfigForm, sqlServerConfig)
      break
    case DatabaseConnectionType.ORACLE_CONNECTION:
      Object.assign(databaseConfigForm, oracleConfig)
      break
    case DatabaseConnectionType.POSTGRESQL_CONNECTION:
      Object.assign(databaseConfigForm, postgreSqlConfig)
      break
    default:
      break
  }

  for (let key in item) {
    if (databaseConfigForm.hasOwnProperty(key)) {
      databaseConfigForm[key] = item[key];
    }
  }
  currentDatabaseConfig = item
  isAddNewDatabaseConfig.value = false
  databaseFormVisible.value = true
}

function handleBeforeAddDatabaseConfig() {
  Object.assign(databaseConfigForm, mySqlConfig)
  isAddNewDatabaseConfig.value = true
  databaseFormVisible.value = true
}

function saveDatabaseConfig() {
  const newDatabaseConfig = { ...databaseConfigForm };
  if (newDatabaseConfig.name == '') {
    ElMessage({
      message: '名称不能为空',
      type: 'error',
    })
    return
  }
  if (isAddNewDatabaseConfig.value) {
    newDatabaseConfig.type = GlobalConfigTypeInGeneral.DATABASE_CONFIG
    if (insertGlobalConfig(newDatabaseConfig)) {
      databaseConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG)
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
    databaseFormVisible.value = false
  }
  else {
    if (newDatabaseConfig.name == currentDatabaseConfig.name) {
      editGlobalConfig(currentDatabaseConfig, newDatabaseConfig)
      databaseConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG)
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
    }
    else {
      const isExist = findGlobalConfigByName(newDatabaseConfig.name)
      if (isExist) {
        ElMessage({
          message: '修改失败，名称不能重复',
          type: 'error',
        })
        return
      }
      else {
        if (connectorConfiguration.value == currentDatabaseConfig.name) {
          connectorConfiguration.value = newDatabaseConfig.name
        }
        nodes.value.forEach((node, index) => {
          if (node.type == NodeType.DATABASE && node.data.connectorConfiguration == currentDatabaseConfig.name) {
            node.data.connectorConfiguration = newDatabaseConfig.name
          }
        });
        editGlobalConfig(currentDatabaseConfig, newDatabaseConfig)
        databaseConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG)
        ElMessage({
          message: '修改成功',
          type: 'success',
        })
      }
    }
    databaseFormVisible.value = false
  }
}

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
}

.database-container {
  width: 100%;
  height: 160px;
  border-radius: 5px;
  border: 1px solid #dedfe0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin-top: 5px;
}

.database-span-container {
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

.database-span {
  line-height: 100%;
  -webkit-writing-mode: vertical-lr;
      -ms-writing-mode: tb-lr;
          writing-mode: vertical-lr;
  letter-spacing: 0.5em;
  margin-top: 10px;
  font-weight: bold;
}

.database-right-container {
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

.database-button-container {
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

.database-button {
  width: 95%;
  height: 30px;
  position: relative;
}

.database-button:hover {
  background-color: #c6e2ff;
}

.database-text {
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

.database-button-container:hover .delete-button {
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