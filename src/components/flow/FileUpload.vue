<template>
  <el-upload
    ref="upload"
    class="upload-demo"
    :on-exceed="handleExceed"
    :auto-upload="false"
    :before-remove="beforeRemove"
    style="width: 100%"
    limit="1"
    accept=".xml"
    :httpRequest="fileSubmit"
  >
    <template #trigger>
      <el-button type="primary" style="margin-right: 30px"
        >上传XML文件</el-button
      >
    </template>
    <el-button class="ml-3" type="success" @click="submitUpload">
      转成业务流
    </el-button>
  </el-upload>
</template>

<script setup>
import { ref } from 'vue'
import { genFileId, ElMessageBox } from 'element-plus'
// import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { findNodeById, nodes } from '@/hooks/useNode'
import useDragAndDrop from '@/hooks/useDnD'
import useCanvasManage from '@/hooks/useCanvasManage'
import { setGlobalConfig } from '@/hooks/useGlobalConfig'
import { dragAdsorption } from '@/hooks/useAdsorption'
import { useVueFlow } from '@vue-flow/core'
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
  console.log(file.file)
  await uploadXML({ file: file.file }).then(
    (res) => {
      console.log(res)
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
  // let data = {
  //   globalConfig: [],
  //   nodes: [
  //     {
  //       id: 'bf81aaa8-4564-4cdb-91ae-a9a6ef763603',
  //       type: 'Flow',
  //       data: { displayName: 'flow' },
  //       childNodes: ['53338e03-11be-45b9-b094-bc1357e7b958'],
  //     },
  //     {
  //       id: '53338e03-11be-45b9-b094-bc1357e7b958',
  //       type: 'Request',
  //       data: {
  //         displayName: 'Request',
  //         connectorConfiguration: '',
  //         method: '',
  //         path: '',
  //         url: '',
  //         body: '',
  //         headers: '{"Key":"Value","Key_1":"Value","Key_2":"Value"}',
  //       },
  //       parentNode: 'bf81aaa8-4564-4cdb-91ae-a9a6ef763603',
  //     },
  //   ],
  // }

  let getFlowPos = []
  await createNewCanvas()

  setGlobalConfig(data.globalConfig)
  let myNodes = []
  let choiceDefaultsNode = []
  let x = 0,
    y = 0
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
      // await nextTick()
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
      // choiceDefaultsNode.push(node)
      data.nodes.splice(i, 1)
      i--
      len--
    }
  }
  // ;[x, y] = [0, 30]
  while (myNodes.length > 0) {
    let parentNode = myNodes.shift()
    // if (parentNode.type == NodeType.FLOW) {
    //   for (let i = 1, len = getFlowPos.length; i < len; i++) {
    //     if (getFlowPos[i] === parentNode.id) {
    //       let preNode = findNodeById(getFlowPos[i - 1])
    //       parentNode.position.y = y + parseInt(preNode.style.height)
    //       parentNode.position.x = 0
    //       x = 0
    //       y = parentNode.position.y + 30
    //       dragAdsorption(parentNode, { layerX: x, layerY: y - 30 })
    //     }
    //   }
    // }
    let childNodes = parentNode.childNodes ? [...parentNode.childNodes] : []
    parentNode.childNodes = []
    for (let j = 0, len2 = childNodes.length; j < len2; j++) {
      let childNodeId = childNodes[j]
      for (let k = 0, len3 = data.nodes.length; k < len3; k++) {
        let nodeJson = data.nodes[k]
        if (nodeJson.id === childNodeId) {
          nodeJson.parentNode = undefined
          let item = jsonTurnNode(nodeJson, { x: 0, y: 0 }, parentNode)
          // await nextTick()
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
  }
  ;[x, y] = [0, 30]
  findNodeById(1)
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
