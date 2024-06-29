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

<script setup lang="ts">
import { ref } from 'vue'
import { genFileId, ElMessageBox } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import { findNodeById, nodes } from '@/hooks/useNode'
import useDragAndDrop from '@/hooks/useDnD'
import useCanvasManage from '@/hooks/useCanvasManage'
import { setGlobalConfig } from '@/hooks/useGlobalConfig'
import { useVueFlow } from '@vue-flow/core'
import { NodeType } from '../../enums/NodeType'
import { uploadXML } from '@/service/CanvasService.js'
const { jsonTurnNode } = useDragAndDrop()
const upload = ref<UploadInstance>()
const { createNewCanvas } = useCanvasManage()
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
const submitUpload = () => {
  upload.value!.submit()
}

const beforeRemove: UploadProps['beforeRemove'] = (uploadFile, uploadFiles) => {
  return ElMessageBox({
    title: '',
    message: `确认取消上传 ${uploadFile.name} ?`,
    confirmButtonText: '确认',
  }).then(
    () => true,
    () => false
  )
}
async function fileSubmit(file: UploadRawFile) {
  console.log(file)
  // await uploadXML(file).then((res) => {
  //   console.log(res)
  // })
  //如果转成data.json成功，则调用下面方法新建画布
  createXmlTurnPaint()
}
async function createXmlTurnPaint() {
  let data = {
    globalConfig: [],
    nodes: [
      {
        id: '0e1d208e-feea-445b-b98c-9c5f06f27cc6',
        type: 'ChoiceDefault',
        data: {},
        parentNode: '71a038a3-504a-4204-9f0b-a1698f500f12',
        childNodes: ['2146f6ca-5462-42ee-911a-86aaf59f88c8'],
      },
      {
        id: 'cf5a0bea-3869-4de9-9ec6-30960ab2ee87',
        type: 'Flow',
        data: { displayName: 'flow' },
        childNodes: ['71a038a3-504a-4204-9f0b-a1698f500f12'],
      },
      {
        id: '71a038a3-504a-4204-9f0b-a1698f500f12',
        type: 'Choice',
        data: { displayName: 'Choice' },
        parentNode: 'cf5a0bea-3869-4de9-9ec6-30960ab2ee87',
        defaultNode: '0e1d208e-feea-445b-b98c-9c5f06f27cc6',
        childNodes: [
          '0e1d208e-feea-445b-b98c-9c5f06f27cc6',
          '2316fd69-5644-4473-ac4e-74e1425c7bca',
        ],
      },
      {
        id: '2316fd69-5644-4473-ac4e-74e1425c7bca',
        type: 'ChoiceWhen',
        data: { expression: '' },
        parentNode: '71a038a3-504a-4204-9f0b-a1698f500f12',
        childNodes: ['8caa2543-1e69-409f-b8ec-67d00c5cfbff'],
      },
      {
        id: '2146f6ca-5462-42ee-911a-86aaf59f88c8',
        type: 'Database',
        data: {
          displayName: 'Database',
          operation: '',
          connectorConfiguration: '',
          sqlCommand: '',
          inputParameters: '',
        },
        parentNode: '0e1d208e-feea-445b-b98c-9c5f06f27cc6',
      },
      {
        id: '8caa2543-1e69-409f-b8ec-67d00c5cfbff',
        type: 'Database',
        data: {
          displayName: 'Database',
          operation: '',
          connectorConfiguration: '',
          sqlCommand: '',
          inputParameters: '',
        },
        parentNode: '2316fd69-5644-4473-ac4e-74e1425c7bca',
      },
      {
        id: '53f86805-6b11-4ca4-86e1-7a496dc65a40',
        type: 'ChoiceDefault',
        data: {},
        parentNode: 'b019ecf0-ea73-4f88-9eb5-0bf4daaabdb1',
        childNodes: [],
      },
      {
        id: '6d91e8c5-8f07-4e44-8fa8-15bf5a8e1537',
        type: 'Flow',
        data: { displayName: 'flow_1' },
        childNodes: ['b019ecf0-ea73-4f88-9eb5-0bf4daaabdb1'],
      },
      {
        id: 'b019ecf0-ea73-4f88-9eb5-0bf4daaabdb1',
        type: 'Choice',
        data: { displayName: 'Choice' },
        parentNode: '6d91e8c5-8f07-4e44-8fa8-15bf5a8e1537',
        defaultNode: '53f86805-6b11-4ca4-86e1-7a496dc65a40',
        childNodes: ['53f86805-6b11-4ca4-86e1-7a496dc65a40'],
      },
    ],
  }
  let getFlowPos = []
  await createNewCanvas()

  setGlobalConfig(data.globalConfig)
  let myNodes: any[] = []
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
  }
}
</script>
