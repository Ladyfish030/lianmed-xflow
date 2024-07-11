<template>
  <el-upload 
    ref="upload" 
    class="upload-demo"
    :on-exceed="handleExceed" 
    :auto-upload="false"
    :before-remove="beforeRemove" 
    :limit="1" 
    accept=".xml" 
    :httpRequest="fileSubmit"
  >
    <template #trigger>
      <el-button type="primary" style="width: 110px;">上传XML文件</el-button>
    </template>
    <el-button type="success" @click="submitUpload" style="width: 110px; margin-left: 20px; ">
      转成业务流
    </el-button>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { genFileId, ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import { findNodeById } from '@/hooks/useNode'
import useDragAndDrop from '@/hooks/useDnD'
import useCanvasManage from '@/hooks/useCanvasManage'
import { setGlobalConfig } from '@/hooks/useGlobalConfig'
import { dragAdsorption } from '@/hooks/useAdsorption'
import { NodeType } from '../../enums/NodeType'
import { uploadXML } from '@/service/CanvasService.js'

const { jsonTurnNode } = useDragAndDrop()
const emit = defineEmits(['close'])
const upload = ref()
const { createNewCanvas } = useCanvasManage()

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

const submitUpload = () => {
  upload.value.submit()
}

const beforeRemove = (uploadFile, uploadFiles) => {
  return ElMessageBox({
    title: '',
    message: `确认取消上传 ${uploadFile.name} ?`,
    confirmButtonText: '确认',
  }).then(
    () => true,
    () => false
  )
}

async function fileSubmit(file) {
  await uploadXML({ file: file.file }).then(
    (res) => {
      ElMessage({
        message: '转换成功',
        type: 'success',
      })
      createXmlTurnPaint(res)
    },
    () => {
      ElMessage({
        message: '转换失败，请检查XML文件中是否存在错误',
        type: 'error',
      })
    }
  )
  emit('close', true)
}

async function createXmlTurnPaint(data) {
  let getFlowPos = []
  await createNewCanvas()

  setGlobalConfig(data.globalConfig)
  let myNodes = []
  let choiceDefaultsNode = []
  let x = 0, y = 0

  for (let i = 0, len = data.nodes.length; i < len; i++) {
    let node = data.nodes[i]
    if (node.type === NodeType.CHOICEDEFAULT) {
      choiceDefaultsNode.push(node)
    }
  }
  for (let i = 0, len = data.nodes.length; i < len; i++) {
    let node = data.nodes[i]
    if (!node.parentNode) {
      let item = jsonTurnNode(node, { x: x, y: y })
      if (node.type === NodeType.CHOICE) {
        item[0].childNodes = choiceDefaultsNode.find((e) => {
          return e.parentNode === node.id
        })?.childNodes
        item[1].childNodes = node.childNodes?.slice(1)
      }
      getFlowPos.push(item[0].id)
      Array.prototype.push.apply(myNodes, item)
      data.nodes.splice(i, 1)
      i--
      len--
      x += 1000
      y += 1000
    }

    if (node.type === NodeType.CHOICEDEFAULT) {
      data.nodes.splice(i, 1)
      i--
      len--
    }
  }

  while (myNodes.length > 0) {
    let parentNode = myNodes.shift()
    let childNodes = parentNode.childNodes ? [...parentNode.childNodes] : []
    parentNode.childNodes = []

    for (let j = 0, len2 = childNodes.length; j < len2; j++) {
      let childNodeId = childNodes[j]
      for (let k = 0, len3 = data.nodes.length; k < len3; k++) {
        let nodeJson = data.nodes[k]
        if (nodeJson.id === childNodeId) {
          nodeJson.parentNode = undefined
          let item = jsonTurnNode(nodeJson, { x: 0, y: 0 }, parentNode)
          if (nodeJson.type === NodeType.CHOICE) {
            item[0].childNodes = choiceDefaultsNode.find((e) => {
              return e.parentNode === nodeJson.id
            })?.childNodes
            item[0].data = choiceDefaultsNode.find((e) => {
              return e.parentNode === nodeJson.id
            })?.data
            item[1].childNodes = nodeJson.childNodes?.slice(1)
          }
          Array.prototype.push.apply(myNodes, item)
          data.nodes.splice(k, 1)
          k--
          len3--
        }
      }
    }
  };
  [x, y] = [0, 30]
  for (let i = 1, len = getFlowPos.length; i < len; i++) {
    let preNode = findNodeById(getFlowPos[i - 1])
    let nowNode = findNodeById(getFlowPos[i])
    if (!nowNode) {
      break
    }
    nowNode.position.y = y + parseInt(preNode.style.height)
    nowNode.position.x = 0
    x = 0
    y = nowNode.position.y + 30
    dragAdsorption(nowNode, { layerX: x, layerY: y - 30 })
  }
}
</script>

<style scoped>
.upload-demo {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

:deep(.el-upload-list__item-file-name) {
  line-height: 1.5;
}
</style>