<template>
  <div class="button-container">
    <el-tooltip content="保存" placement="bottom" effect="dark" :hide-after="0">
      <button class="tool-button" @click="onSaveCanvas">
        <SaveFlowIcon />
      </button>
    </el-tooltip>

    <el-tooltip content="历史业务流" placement="bottom" effect="dark" :hide-after="0">
      <div>
        <HistoryCanvas />
      </div>
    </el-tooltip>

    <el-tooltip content="生成XML" placement="bottom" effect="dark" :hide-after="0">
      <button class="tool-button" @click="generateXmlFile">
        <GenerateXmlFileIcon />
      </button>
    </el-tooltip>
    <el-tooltip content="XML转业务流" placement="bottom" effect="dark" :hide-after="0">
      <button class="tool-button" @click="xmlTurnPaint">
        <XMLturnPaint />
      </button>
    </el-tooltip>
  </div>

  <XmlGeneratedResultDialog 
    v-if="xmlGeneratedResultVisible"
    :data="xmlData"
    @close="handleCloseXmlDialog"
  />

  <el-dialog
    v-model="isFileUploadShow"
    title="XML文件转业务流"
    width="300"
    :align-center="true"
  >
    <file-upload @close="closeFileUpload"></file-upload>
  </el-dialog>
</template>

<script setup>
import { ref, h } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { ElMessage, ElMessageBox } from 'element-plus'

import SaveFlowIcon from '@/assets/svg/SaveFlowIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'
import XMLturnPaint from '@/assets/svg/XMLturnPaint.vue'
import FileUpload from '@/components/flow/FileUpload.vue'
import HistoryCanvas from '@/components/flow/HistoryCanvas.vue'
import XmlGeneratedResultDialog from '@/components/XmlGeneratedResultDialog.vue'

import useCanvasManage from '@/hooks/useCanvasManage'
import { getParentPos } from '@/hooks/useAdsorption'
import { getFlowList } from '@/hooks/useNodeOfFlow'

import {
  saveCanvas,
  updateCanvas,
  downloadFlowXML,
} from '@/service/CanvasService.js'
import { formatGenerateFlowXmlData } from '@/service/dto/GenerateXmlDTO'

let isFileUploadShow = ref(false)
const { toObject } = useVueFlow()
const { canvasList, getCurrentCanvas } = useCanvasManage()
const xmlGeneratedResultVisible = ref(false)
const xmlData = ref('')

async function onSaveCanvas() {
  if (canvasList.value.length === 0) {
    ElMessage({
      type: 'warning',
      message: '当前无业务流',
    })
    return
  }
  const canvas = {
    paint: toObject(),
    flowList: getFlowList(),
    parentPos: getParentPos(),
  }
  var currentCanvas = getCurrentCanvas()
  if (currentCanvas.id === undefined) {
    await ElMessageBox.prompt('', '请输入业务流名称', {
      confirmButtonText: '保存',
      cancelButtonText: '取消',
      inputValue: currentCanvas.name,
      inputPattern: /\S/,
      inputErrorMessage: '业务流名称不能为空',
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
  } else {
    await updateCanvas({
      id: String(currentCanvas.id),
      canvas: canvas,
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
      message: '当前无业务流',
    })
    return
  }
  const sendData = formatGenerateFlowXmlData()
  console.log(JSON.stringify(sendData))
  await downloadFlowXML(sendData)
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

function handleCloseXmlDialog() {
  xmlGeneratedResultVisible.value = false
}

function xmlTurnPaint() {
  isFileUploadShow.value = true
}

function closeFileUpload() {
  isFileUploadShow.value = false
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

.history-paint {
  position: relative;
  display: block;
  height: 10px;
  width: 300px;
}
</style>
