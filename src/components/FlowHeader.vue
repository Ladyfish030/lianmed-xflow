<template>
  <div class="button-container">
    <el-tooltip content="保存" placement="bottom" effect="dark">
      <button @click="onSave">
        <SaveFlowIcon />
      </button>
    </el-tooltip>
    <el-tooltip content="历史画布" placement="bottom" effect="dark">
      <button @click="showHistoryPaint">
        <HistoryPaintIcon></HistoryPaintIcon>
      </button>
    </el-tooltip>
    <el-tooltip content="生成XML" placement="bottom" effect="dark">
      <button @click="generateXmlFile">
        <GenerateXmlFileIcon />
      </button>
    </el-tooltip>
  </div>
  <div class="history-paint" v-if="isShowHistoryPaint">
    <HistoryPaint></HistoryPaint>
  </div>

  <el-dialog
    v-model="xmlGeneratedResultVisible"
    title="XML"
    width="800"
    top="5vh"
  >
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
import { useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import SaveFlowIcon from '@/assets/svg/SaveFlowIcon.vue'
import HistoryPaintIcon from '@/assets/svg/HistoryPaintIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'

import { setParentPos, getParentPos } from '../hooks/useAdsorption'
import { getGlobalConfig, setGlobalConfig } from '../hooks/useGlobalConfig'
import { getPaintName, setPaintName, getPaintId } from '../hooks/usePaint'

import HistoryPaint from '@/components/HistoryPaint.vue'

import { saveCanvas, deleteCanvas, downloadXML } from '../service/CanvasService.js'
import { formatGenerateXmlData } from '../service/dto/GenerateXmlDTO'

const { toObject, fromObject } = useVueFlow()
let isShowHistoryPaint = ref(false)
const xmlGeneratedResultVisible = ref(false)
const xmlData = ref('')

function onSave() {
  let canvas = {
    paint: toObject(),
    parentPos: getParentPos(),
    globalConfig: getGlobalConfig(),
  }
  ElMessageBox.prompt('', '请输入画布名字', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    inputValue: getPaintName(),
    inputPattern: /\S/,
    inputErrorMessage: '画布名不能为空',
  })
    .then(({ value }) => {
      setPaintName(String(value).trim())
      if (getPaintId()) {
        console.log('进来删除')
        deleteCanvas({ id: getPaintId() }).catch(() => {
          setPaintName('')
        })
      }
      saveCanvas({
        canvas: canvas,
        name: String(value).trim(),
      }).then((res) => {
        ElMessage({
          type: 'success',
          message: '保存画布成功',
        })
        console.log(res)
      })
    })
    .catch((err) => {
      console.log(err)
      ElMessage({
        type: 'info',
        message: '取消保存',
      })
    })
}

function showHistoryPaint() {
  isShowHistoryPaint.value = !isShowHistoryPaint.value
}

function generateXmlFile() {
  const sendData = formatGenerateXmlData()
  downloadXML(sendData)
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

.button-container > button {
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

.button-container > button:hover {
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
  width: 30%;
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