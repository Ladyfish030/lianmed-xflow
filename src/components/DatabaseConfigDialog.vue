<template>
    <el-dialog 
      v-model="configDialogVisible" 
      title="数据库属性" 
      width="400" 
      top="10vh"
      :close-on-click-modal="false" 
      @close="closeDialog()"
      :append-to-body="true"
    >
        <el-form :model="currentConfigForm">
            <el-form-item label="名称" :label-width="formLabelWidth">
                <el-input v-model="currentConfigForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="数据库类型" :label-width="formLabelWidth">
                <el-select v-model="currentConfigForm.connection" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in databaseConnectionTypeList" :key="index" :label="item"
                        :value="item" />
                </el-select>
            </el-form-item>

            <div v-if="currentConfigForm.connection === DatabaseConnectionType.MYSQL_CONNECTION">
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.host" autocomplete="off" />
                </el-form-item>
                <el-form-item label="端口号" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.port" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" show-password v-model="currentConfigForm.password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="数据库名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.database" autocomplete="off" />
                </el-form-item>
                <el-form-item label="驱动" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.driver" autocomplete="off" />
                </el-form-item>
            </div>

            <div v-if="currentConfigForm.connection === DatabaseConnectionType.SQLSERVER_CONNECTION">
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.host" autocomplete="off" />
                </el-form-item>
                <el-form-item label="端口号" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.port" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" show-password v-model="currentConfigForm.password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="实例名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.instanceName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="数据库名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.database" autocomplete="off" />
                </el-form-item>
                <el-form-item label="驱动" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.driver" autocomplete="off" />
                </el-form-item>
            </div>

            <div v-if="currentConfigForm.connection === DatabaseConnectionType.ORACLE_CONNECTION">
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.host" autocomplete="off" />
                </el-form-item>
                <el-form-item label="端口号" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.port" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" show-password v-model="currentConfigForm.password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="实例名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.instanceName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="服务名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.serviceName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="驱动" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.driver" autocomplete="off" />
                </el-form-item>
            </div>

            <div v-if="currentConfigForm.connection === DatabaseConnectionType.POSTGRESQL_CONNECTION">
                <el-form-item label="主机名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.host" autocomplete="off" />
                </el-form-item>
                <el-form-item label="端口号" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.port" autocomplete="off" />
                </el-form-item>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth">
                    <el-input type="password" show-password v-model="currentConfigForm.password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="数据库名" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.database" autocomplete="off" />
                </el-form-item>
                <el-form-item label="驱动" :label-width="formLabelWidth">
                    <el-input v-model="currentConfigForm.driver" autocomplete="off" />
                </el-form-item>
            </div>
        </el-form>
        <template #footer>
            <div>
                <el-button @click="configDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveConfigHandler()">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
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
import { DatabaseConnectionType } from '@/components/flow/nodes/attribute/DatabaseConnectionType.js'

import {
  getGlobalConfigByName,
  saveGlobalConfig,
  getAllGlobalConfig,
  updateGlobalConfig,
} from '@/service/GlobalConfigService'

const formLabelWidth = '90px'
const databaseConnectionTypeList = computed(() => {
  const types = [];
  for (const key in DatabaseConnectionType) {
    if (Object.prototype.hasOwnProperty.call(DatabaseConnectionType, key)) {
      types.push(DatabaseConnectionType[key]);
    }
  }
  return types;
})

function closeDialog() {
  configDialogVisible.value = false
}

async function saveConfigHandler() {
  const fetchAllGlobalConfigs = async () => {
    try {
      const res = await getAllGlobalConfig();
      globalConfigList.value = res.map(config => JSON.parse(config.globalJson));
      typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG);
    } catch (error) {
      ElMessage({
        type: 'error',
        message: '获取全局配置错误',
      });
    }
  };

  const newConfig = JSON.parse(JSON.stringify(currentConfigForm));
  if (newConfig.name == '') {
    ElMessage({
      message: '名称不能为空',
      type: 'error',
    });
    return;
  }
  if (isAddConfig.value === true) {
    newConfig.type = GlobalConfigTypeInGeneral.DATABASE_CONFIG;
    await getGlobalConfigByName(newConfig.name)
      .then(async (res) => {
        if (Object.keys(res).length !== 0) {
          ElMessage({
            type: 'error',
            message: '全局配置名称不能重复',
          });
        } else {
          await saveGlobalConfig(newConfig)
            .then(async (res) => {
              ElMessage({
                message: '保存成功',
                type: 'success',
              });
              await fetchAllGlobalConfigs();
              typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG);
              configDialogVisible.value = false;
            })
            .catch((error) => {
              ElMessage({
                type: 'error',
                message: '保存失败',
              });
            });
        }
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: '获取全局配置错误',
        });
      });
  } else {
    if (newConfig.name === temporaryConfigForm.name) {
      await updateGlobalConfig(newConfig)
        .then(async (res) => {
          ElMessage({
            message: '修改成功',
            type: 'success',
          });
          await fetchAllGlobalConfigs();
          typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG);
        })
        .catch((error) => {
          ElMessage({
            type: 'error',
            message: `修改失败：${error}`,
          });
        });
    } else {
      await getGlobalConfigByName(newConfig.name)
        .then(async (res) => {
          if (Object.keys(res).length !== 0) {
            ElMessage({
              type: 'error',
              message: '全局配置名称不能重复',
            });
          } else {
            await updateGlobalConfig(newConfig)
              .then(async (res) => {
                ElMessage({
                  message: '修改成功',
                  type: 'success',
                });
                await fetchAllGlobalConfigs();
                typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.DATABASE_CONFIG);
              })
              .catch((error) => {
                ElMessage({
                  type: 'error',
                  message: `修改失败：${error}`,
                });
              });
          }
        })
        .catch((error) => {
          ElMessage({
            type: 'error',
            message: '获取全局配置错误',
          });
        });
    }
  }
}

watch(() => currentConfigForm.connection, (newValue, oldValue) => {
  let config = {}
  if (isAddConfig.value === false) {
    config.id = currentConfigForm.id
    config.type = currentConfigForm.type
  }
  switch (newValue) {
    case DatabaseConnectionType.MYSQL_CONNECTION:
      Object.assign(config, { ...GlobalConfigForm.MySqlConfig })
      Object.keys(config).forEach(key => {
        if (key in currentConfigForm) {
          config[key] = currentConfigForm[key];
        }
      });
      Object.keys(currentConfigForm).forEach(key => {
        delete currentConfigForm[key]
      })
      Object.assign(currentConfigForm, { ...config })
      break
    case DatabaseConnectionType.SQLSERVER_CONNECTION:
      Object.assign(config, { ...GlobalConfigForm.SqlServerConfig })
      Object.keys(config).forEach(key => {
        if (key in currentConfigForm) {
          config[key] = currentConfigForm[key];
        }
      });
      Object.keys(currentConfigForm).forEach(key => {
        delete currentConfigForm[key]
      })
      Object.assign(currentConfigForm, { ...config })
      break
    case DatabaseConnectionType.ORACLE_CONNECTION:
      Object.assign(config, { ...GlobalConfigForm.OracleConfig })
      Object.keys(config).forEach(key => {
        if (key in currentConfigForm) {
          config[key] = currentConfigForm[key];
        }
      });
      Object.keys(currentConfigForm).forEach(key => {
        delete currentConfigForm[key]
      })
      Object.assign(currentConfigForm, { ...config })
      break
    case DatabaseConnectionType.POSTGRESQL_CONNECTION:
      Object.assign(config, { ...GlobalConfigForm.PostgreSqlConfig })
      Object.keys(config).forEach(key => {
        if (key in currentConfigForm) {
          config[key] = currentConfigForm[key];
        }
      });
      Object.keys(currentConfigForm).forEach(key => {
        delete currentConfigForm[key]
      })
      Object.assign(currentConfigForm, { ...config })
      break
    default:
      return
  }
})
</script>

<style scoped>
.input-field {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>