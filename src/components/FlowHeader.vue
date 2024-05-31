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
</template>
<script setup>
import { useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import { setParentPos, getParentPos } from '../hooks/useAdsorption'
import { nodes } from '../hooks/useNode'
import { edges } from '../hooks/useEdge'
import {
  globalConfigList,
  getGlobalConfig,
  setGlobalConfig,
} from '../hooks/useGlobalConfig'

import { NodeType } from '../enums/NodeType'
import { GlobalConfigTypeInDetail } from '../enums/GlobalConfigTypeInDetail'
import { GlobalConfigTypeInGeneral } from '../enums/GlobalConfigTypeInGeneral'
import * as NodeAttributes from '../components/nodes/attribute/AttributesNeededToGenerateXml'
import * as ConfigAttributes from '../enums/GlobalConfigAttribute'

import SaveFlowIcon from '@/assets/svg/SaveFlowIcon.vue'
import HistoryPaintIcon from '@/assets/svg/HistoryPaintIcon.vue'
import GenerateXmlFileIcon from '@/assets/svg/GenerateXmlFileIcon.vue'

import HistoryPaint from '@/components/HistoryPaint.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { saveCanvas, deleteCanvas } from '../http/api'
import { getPaintName, setPaintName, getPaintId } from '../hooks/usePaint'
const flowKey = 'xFlow'
const parentPos = 'parentPos'
const globalConfig = 'globalConfig'
const { toObject, fromObject } = useVueFlow()
let isShowHistoryPaint = ref(false)

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
  })
    .then(({ value }) => {
      setPaintName(value)
      if (getPaintId()) {
        deleteCanvas({ id: getPaintId() })
      }
      saveCanvas({
        canvas: canvas,
        name: value,
      }).then((res) => {
        ElMessage({
          type: 'success',
          message: '保存画布成功',
        })
        console.log(res)
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消保存',
      })
    })
}

function onRestore() {
  const flow = JSON.parse(localStorage.getItem(flowKey))
  if (flow) {
    ElMessageBox.confirm('确定载入草稿？这将会覆盖当前数据')
      .then(() => {
        fromObject(flow)
        setParentPos(JSON.parse(localStorage.getItem(parentPos)) || [])
        setGlobalConfig(JSON.parse(localStorage.getItem(globalConfig)) || [])
        ElMessage({
          message: '载入草稿成功',
          type: 'success',
        })
        return
      })
      .catch(() => {
        // catch error
      })
  } else {
    ElMessage({
      message: '草稿箱为空',
      type: 'warning',
    })
  }
}

function onClear() {
  ElMessageBox.confirm('确定清空草稿箱？')
    .then(() => {
      localStorage.clear()
      ElMessage({
        message: '清空草稿成功',
        type: 'success',
      })
      return
    })
    .catch(() => {
      // catch error
    })
}
function showHistoryPaint() {
  isShowHistoryPaint.value = !isShowHistoryPaint.value
}
function organizeData() {
  var result = {
    globalConfig: [],
    nodes: [],
    edges: [],
  }

  const configMappings = {
    [GlobalConfigTypeInDetail.DATABASE_MYSQL_CONFIG]: ConfigAttributes.MySQL,
    [GlobalConfigTypeInDetail.DATABASE_SQLSERVER_CONFIG]:
      ConfigAttributes.SQLServer,
    [GlobalConfigTypeInDetail.DATABASE_ORACLE_CONFIG]: ConfigAttributes.Oracle,
    [GlobalConfigTypeInDetail.DATABASE_POSTGRESQL_CONFIG]:
      ConfigAttributes.PostgreSQL,
    [GlobalConfigTypeInDetail.LISTENER_CONFIG]: ConfigAttributes.Listener,
  }
  const nodeMappings = {
    [NodeType.FLOW]: NodeAttributes.Flow,
    [NodeType.DATABASE]: NodeAttributes.Database,
    [NodeType.WEBSERVICE]: NodeAttributes.WebService,
    [NodeType.LISTENER]: NodeAttributes.Listener,
    [NodeType.CHOICE]: NodeAttributes.Choice,
    [NodeType.CHOICEWHEN]: NodeAttributes.ChoiceWhen,
    [NodeType.CHOICEDEFAULT]: NodeAttributes.ChoiceDefault,
    [NodeType.FOREACH]: NodeAttributes.ForEach,
    [NodeType.SUBFLOW]: NodeAttributes.SubFlow,
    [NodeType.LOGGER]: NodeAttributes.Logger,
    [NodeType.FLOWREFERENCE]: NodeAttributes.FlowReference,
  }

  const configList = globalConfigList.value
  for (const config of configList) {
    var type = config.type
    if (type == GlobalConfigTypeInGeneral.DATABASE_CONFIG) {
      type = config.connection
    }
    if (configMappings.hasOwnProperty(type)) {
      const targetConfig = JSON.parse(JSON.stringify(configMappings[type]))
      for (const prop in targetConfig) {
        if (targetConfig.hasOwnProperty(prop) && config.hasOwnProperty(prop)) {
          targetConfig[prop] = config[prop]
        }
      }
      result.globalConfig.push(targetConfig)
    }
  }

  const nodeList = nodes.value
  for (const node of nodeList) {
    const type = node.type
    if (nodeMappings.hasOwnProperty(type)) {
      const targetNode = JSON.parse(JSON.stringify(nodeMappings[type]))
      for (const prop in targetNode) {
        if (targetNode.hasOwnProperty(prop) && node.hasOwnProperty(prop)) {
          targetNode[prop] = node[prop] == undefined ? null : node[prop]
        }
      }
      result.nodes.push(targetNode)
    }
  }

  const edgeList = edges.value
  for (const edge of edgeList) {
    const targetEdge = {}
    targetEdge.id = edge.id
    targetEdge.source = edge.source
    targetEdge.target = edge.target
    result.edges.push(targetEdge)
  }

  return result
}

function generateXmlFile() {
  const sendData = JSON.stringify(organizeData())
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
</style>
