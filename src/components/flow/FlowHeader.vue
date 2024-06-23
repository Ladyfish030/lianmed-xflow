<template>
  <div class="button-container">
    <el-tooltip content="保存" placement="bottom" effect="dark">
      <button class="tool-button" @click="onSaveCanvas">
        <SaveFlowIcon />
      </button>
    </el-tooltip>

    <el-tooltip content="历史业务流" placement="top" effect="dark">
      <div>
        <HistoryCanvas />
      </div>
    </el-tooltip>

    <el-tooltip content="生成XML" placement="bottom" effect="dark">
      <button class="tool-button" @click="generateXmlFile">
        <GenerateXmlFileIcon />
      </button>
    </el-tooltip>
  </div>

  <el-dialog v-model="xmlGeneratedResultVisible" title="XML" width="800" top="5vh">
    <div class="xml-container">
      <div class="xml-scrollbar-container">
        <el-scrollbar>
          <div class="xml-content-container">
            <highlightjs language="xml" :code="xmlData" />
          </div>
        </el-scrollbar>
      </div>
    </div>

    <template #footer>
      <div>
        <el-button @click="copyToClipboard">复制</el-button>
        <el-button type="primary" @click="downloadXmlFile">下载</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { ElMessage, ElMessageBox } from 'element-plus'

import SaveFlowIcon from '@/assets/svg/SaveFlowIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'

import HistoryCanvas from '@/components/flow/HistoryCanvas.vue'

import useCanvasManage from '@/hooks/useCanvasManage'
import { getParentPos } from '@/hooks/useAdsorption'
import { getGlobalConfig } from '@/hooks/useGlobalConfig'
import { getFlowList } from '@/hooks/useNodeOfFlow'

import { saveCanvas, updateCanvas, downloadXML } from '@/service/CanvasService.js'
import { formatGenerateXmlData } from '@/service/dto/GenerateXmlDTO'

const { toObject } = useVueFlow()
const { canvasList, getCurrentCanvas } = useCanvasManage()
const xmlGeneratedResultVisible = ref(false)
const xmlData = ref('')

async function onSaveCanvas() {
  if (canvasList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '当前无画布',
    })
    return
  }
  const canvas = {
    paint: toObject(),
    flowList: getFlowList(),
    parentPos: getParentPos(),
    globalConfig: getGlobalConfig(),
  }
  var currentCanvas = getCurrentCanvas()
  if (currentCanvas.id === undefined) {
    await ElMessageBox.prompt('', '请输入画布名字', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputValue: currentCanvas.name,
      inputPattern: /\S/,
      inputErrorMessage: '画布名不能为空',
    })
      .then(({ value }) => {
        saveCanvas({
          name: String(value).trim(),
          canvas: canvas,
        })
          .then((res) => {
            currentCanvas.id = res.id
            currentCanvas.name = res.name
            currentCanvas.paint = res.canvas.paint
            currentCanvas.flowList = res.canvas.flowList
            currentCanvas.parentPos = res.canvas.parentPos
            currentCanvas.globalConfig = res.canvas.globalConfig
            currentCanvas.isEdited = false
            ElMessage({
              type: 'success',
              message: '保存成功',
            })
          })
          .catch((error) => {
            ElMessage({
              type: 'error',
              message: '保存失败',
            })
          })
      })
      .catch((err) => {
        ElMessage({
          type: 'info',
          message: '取消保存',
        })
      })
  }
  else {
    await updateCanvas({
      id: String(currentCanvas.id),
      canvas: canvas
    })
      .then((res) => {
        ElMessage({
          type: 'success',
          message: '保存成功',
        })
        currentCanvas.isEdited = false
      })
      .catch((error) => {
        ElMessage({
          type: 'error',
          message: '保存失败',
        })
      })
  }
}

async function generateXmlFile() {
  if (canvasList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '当前无画布',
    })
    return
  }
  const sendData = formatGenerateXmlData()
  await downloadXML(sendData)
    .then((res) => {
      xmlData.value = res
    })
    .catch((err) => {
      ElMessage({
        message: '生成XML失败',
        type: 'warning',
      })
    })
  xmlGeneratedResultVisible.value = true
}

function copyToClipboard() {
  navigator.clipboard
    .writeText(xmlData.value)
    .then(() => {
      ElMessage({
        message: '复制成功',
        type: 'success',
      })
    })
    .catch(() => {
      ElMessage({
        message: '复制失败',
        type: 'error',
      })
    })
}

function downloadXmlFile() {
  const blob = new Blob([xmlData.value], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mule_xml.xml'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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

.tooltip-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.history-paint {
  position: relative;
  display: block;
  height: 10px;
  width: 300px;
}

.xml-container {
  width: 100%;
  height: 400px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.xml-scrollbar-container {
  width: 765px;
  height: 395px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.xml-content-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  height: 100%;
  text-align: left;
  font-family: 'Consolas';
  font-size: 14px;
  line-height: 1.5;
}
</style>