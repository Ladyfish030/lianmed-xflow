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
  //   const sendData = JSON.stringify(organizeData())
  //     xmlData.value = `<note>
  //     <to>Tove</to>
  //     <from>Jani</from>
  //     <heading>Reminder</heading>
  //     <body>Don't forget me this weekend!</body>
  // </note>`
  xmlData.value = `<mule xmlns:db="http://www.mulesoft.org/schema/mule/db" xmlns="http://www.mulesoft.org/schema/mule/core" xmlns:doc="http://www.mulesoft.org/schema/mule/documentation" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.mulesoft.org/schema/mule/core http://www.mulesoft.org/schema/mule/core/current/mule.xsd http://www.mulesoft.org/schema/mule/db http://www.mulesoft.org/schema/mule/db/current/mule-db.xsd">
<flow name="get:\getLisInfo:obis_esb" doc:id="11c8bd4a-1e7c-4a89-94b1-75899ee6f1e0">
<logger level="INFO" doc:name="Logger" doc:id="033583d5-7f78-4f09-be3a-b3e9ae34d62e" message="getLisInfo"/>
<logger level="INFO" doc:name="Logger" doc:id="15a8b4d3-2cbc-4c56-86d0-e108542e9eca" message="#[attributes.queryParams]"/>
<flow-ref doc:name="getLisReport" doc:id="1f356695-911a-4102-89c2-45877e9ed29f" name="getLisReport"/>
<set-payload value="#[%dw 2.0 output application/json --- payload]" doc:name="Set Payload" doc:id="d3553024-0765-4dc2-9ebf-bb77782b6cee"/>
</flow>
<flow name="getLisReport" doc:id="37cbef32-9ffe-4a8b-b401-47acf622d2c3">
<db:select doc:name="Select" doc:id="a3486034-9de8-4e6c-9c20-a06b57041a02" config-ref="HIS">
<db:sql>SELECT BRANCHID,BRANCHNAME,APPLYID,SOURCEID,SOURCENAME,VISITNO,OUTPATIENTNO,INVISITNO,INPATIENTNO,TIME,CHECKVISITNO,NAME,SEX,AGE,REPORTID,ITEMNAME,SUBCODES,DETECTDATE,REPORTPERSON,REPORTDATE,SAMPLENO,APPLYDOCID,APPLYDOCNAME,APPLYDATE,APPLYDEPTID,APPLYDEPTNAME,SAMPLETYPE,SAMPLETYPENAME FROM TRANS_CK.V_LISCOA WHERE OUTPATIENTNO=:outpatientNo</db:sql>
<db:input-parameters>
<![CDATA[ #[{ 'outpatientNo':attributes.queryParams.outpatientNo }] ]]>
</db:input-parameters>
</db:select>
<set-payload value="#[%dw 2.0 --- payload map(item,index)->{ profileId: item.REPORTID, reportDate: item.REPORTDATE, sampleNo: item.SAMPLENO, suitNo: item.SUBCODES, suitName: item.ITEMNAME, outpatientNo: item.OUTPATIENTNO, name: item.NAME, age: item.AGE, gender:item.SEX, requestDepName: item.APPLYDEPTNAME, requestDepNo: item.APPLYDEPTID, instrument: '', requestDoctorName: item.APPLYDOCNAME, reportDoctorName: item.REPORTPERSON, diagnosis: '', items:[] }]" doc:name="Set Payload" doc:id="10787883-3566-488b-a1dc-d6a053cc6f6c"/>
<set-variable value="#[[]]" doc:name="reports" doc:id="b3629c0e-10f2-4f23-8957-b9a86e4f5b96" variableName="reports"/>
<foreach doc:name="For Each" doc:id="ecdaad09-9a10-4d90-8394-d6bfcf503586" collection="#[payload]">
<set-variable value="#[payload]" doc:name="report" doc:id="1ef35b33-76f1-46e5-b9da-cf184a797289" variableName="report"/>
<flow-ref doc:name="getLisDetail" doc:id="0ab79e68-92fd-4519-b33d-f39e5b52a2ff" name="getLisDetail"/>
<set-variable value="#[vars.reports ++ [vars.report ++ {'items':payload}]]" doc:name="Set Variable" doc:id="1ddb181c-ae5e-4048-8197-e71f9b21d96d" variableName="reports"/>
</foreach>
<set-payload value="#[vars.reports]" doc:name="Set Payload" doc:id="104f80aa-a7a8-4090-a18a-9f6de3d8d3e1"/>
</flow>
<flow name="getLisDetail" doc:id="a1bdf60e-f103-446a-80cc-c66083cbb437">
<db:select doc:name="Select" doc:id="5b6d56f6-6df7-4456-ae3b-54d406595c9c" config-ref="HIS">
<db:sql>SELECT REPORTID,COMID,COMNAME,ITEMID,ITEMNAME,ITEMCODE,RESULT,RESULTFLAG,REFLOW,REFHIGH,REFEXPECT,RESULTUNIT,CRITICALVALUE FROM TRANS_CK.V_LISCOAX WHERE REPORTID =:profileId</db:sql>
<db:input-parameters>
<![CDATA[ #[{'profileId':payload.profileId}] ]]>
</db:input-parameters>
</db:select>
<set-payload value="#[%dw 2.0 --- payload map(item,index)->{ index: '', itemNo: item.ITEMID, itemName: item.ITEMNAME, result: item.RESULT, unit: item.RESULTUNIT, limit: item.REFEXPECT, normalLow: item.REFLOW, normalHigh: item.REFHIGH, criticalLow: '', criticalHigh: '', criticalValue:item.CRITICALVALUE, state: if(item.RESULTFLAG == '高') 1 else( if(item.RESULT_STATUS_NAME == '低') 2 else null ) }]" doc:name="Set Payload" doc:id="cb636d92-c249-46ca-8791-3bfd51f87907"/>
</flow>
</mule>`
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
