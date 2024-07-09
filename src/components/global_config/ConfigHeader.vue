<template>
  <div class="button-container">
    <el-tooltip content="新增全局配置" placement="bottom" effect="dark" :hide-after="0">
      <button class="tool-button" @click="addGlobalConfigHandler()">
        <AddGlobalConfigIcon />
      </button>
    </el-tooltip>
    <el-tooltip content="生成XML" placement="bottom" effect="dark" :hide-after="0">
      <button class="tool-button" @click="generateXmlFile">
        <GenerateXmlFileIcon />
      </button>
    </el-tooltip>
  </div>
  <AddGlobalConfigDialog v-if="addGlobalConfigDialogVisible"/>
  <XmlGeneratedResultDialog 
    v-if="xmlGeneratedResultVisible"
    :data="xmlData"
    @close="handleCloseXmlDialog"
  />
</template>

<script setup>
import { ref } from 'vue'
import AddGlobalConfigIcon from '@/assets/svg/AddGlobalConfigIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'
import AddGlobalConfigDialog from '@/components/global_config/AddGlobalConfigDialog.vue'
import {
  globalConfigList,
  addGlobalConfigDialogVisible
} from '@/hooks/useGlobalConfig'
import { formatGenerateGlobalConfigXmlData } from '@/service/dto/GenerateXmlDTO'
import { downloadGlobalConfigXML } from '@/service/GlobalConfigService.js'

import XmlGeneratedResultDialog from '@/components/XmlGeneratedResultDialog.vue'

const xmlGeneratedResultVisible = ref(false)
const xmlData = ref('')

function addGlobalConfigHandler() {
  addGlobalConfigDialogVisible.value = true
}

function handleCloseXmlDialog() {
  xmlGeneratedResultVisible.value = false
}

async function generateXmlFile() {
  if (globalConfigList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '无可生成的全局配置',
    })
    return
  }
  const sendData = formatGenerateGlobalConfigXmlData()
  await downloadGlobalConfigXML(sendData)
    .then((res) => {
      xmlData.value = res
      xmlGeneratedResultVisible.value = true
    })
    .catch((err) => {
      ElMessage({
        message: '生成XML失败',
        type: 'error',
      })
    })
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

.tool-button {
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

.tool-button:hover {
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