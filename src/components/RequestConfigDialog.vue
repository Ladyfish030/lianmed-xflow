<template>
    <el-dialog 
        v-model="configDialogVisible" 
        title="请求器属性" 
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
            <el-form-item label="协议" :label-width="formLabelWidth">
                <el-select v-model="currentConfigForm.protocol" placeholder="" class="input-field">
                    <el-option v-for="(item, index) in protocolTypeList" :key="index" :label="item" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="主机名" :label-width="formLabelWidth">
                <el-input v-model="currentConfigForm.host" autocomplete="off" />
            </el-form-item>
            <el-form-item label="端口号" :label-width="formLabelWidth">
                <el-input v-model="currentConfigForm.port" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Base Path" :label-width="formLabelWidth">
                <el-input v-model="currentConfigForm.basePath" autocomplete="off" />
            </el-form-item>
            <el-form-item label="连接空闲超时" :label-width="formLabelWidth">
                <el-input v-model="currentConfigForm.connectionIdleTimeout" autocomplete="off" />
            </el-form-item>
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

import {
  getGlobalConfigByName,
  saveGlobalConfig,
  getAllGlobalConfig,
  updateGlobalConfig,
} from '@/service/GlobalConfigService'

const formLabelWidth = '100px'
const protocolTypeList = ['HTTP', 'HTTPS']

function closeDialog() {
  configDialogVisible.value = false
}

async function saveConfigHandler() {
  const fetchAllGlobalConfigs = async () => {
    try {
      const res = await getAllGlobalConfig();
      globalConfigList.value = res.map(config => JSON.parse(config.globalJson));
      typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG);
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
    newConfig.type = GlobalConfigTypeInGeneral.REQUEST_CONFIG;
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
              typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG);
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
          typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG);
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
                typeConfigList.value = getGlobalConfigListByType(GlobalConfigTypeInGeneral.REQUEST_CONFIG);
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
</script>

<style scoped>
.input-field {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>