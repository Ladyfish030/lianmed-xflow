<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    :node-types="nodeTypes"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @connect="onConnect"
    @node-click="nodeClickHandler"
    @node-double-click="nodeDoubleClickHandler"
    @node-drag-start="nodeDragStartHandler"
    @node-drag-stop="onNodeDragStop"
    @node-context-menu="nodeContextMenuHandler"
    @edge-context-menu="edgeContextMenuHandler"
    @contextmenu.prevent="contextMenuHandler"
    :zoomOnDoubleClick="false"
    :delete-key-code="null"
  >
    <DropzoneBackground />
    <MiniMap pannable />
    <Controls position="top-right" />
    <FlowNodeMenu />
    <FlowEdgeMenu />
    <FlowMenu />
  </VueFlow>
</template>

<script setup>
import { watch, markRaw, computed, watchEffect } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

import DropzoneBackground from '@/components/flow/DropzoneBackground.vue'
import FlowNodeMenu from '@/components/flow/FlowNodeMenu.vue'
import FlowEdgeMenu from '@/components/flow/FlowEdgeMenu.vue'
import FlowMenu from '@/components/flow/FlowMenu.vue'

import Flow from '@/components/flow/nodes/Flow.vue'
import Database from '@/components/flow/nodes/Database.vue'
import WebService from '@/components/flow/nodes/WebService.vue'
import Listener from '@/components/flow/nodes/Listener.vue'
import Choice from '@/components/flow/nodes/Choice.vue'
import ChoiceWhen from '@/components/flow/nodes/ChoiceWhen.vue'
import ChoiceDefault from '@/components/flow/nodes/ChoiceDefault.vue'
import ForEach from '@/components/flow/nodes/ForEach.vue'
import SubFlow from '@/components/flow/nodes/SubFlow.vue'
import Logger from '@/components/flow/nodes/Logger.vue'
import FlowReference from '@/components/flow/nodes/FlowReference.vue'
import SetPayload from './nodes/SetPayload.vue'
import Request from './nodes/Request.vue'

import { NodeType } from '@/enums/NodeType'
import useDragAndDrop from '@/hooks/useDnD'
import { onNodeDoubleClick, drawerClickNode } from '@/hooks/useDrawer'
import { onConnect, edges } from '@/hooks/useEdge'
import { nodes } from '@/hooks/useNode'
import {
  onNodeContextMenu,
  onEdgeContextMenu,
  onFlowContextMenu,
  nodeMenuVisible,
  edgeMenuVisible,
  flowMenuVisible,
  canvasMenuVisible,
  deleteNode,
  deleteNodeConfirm,
  menuToFlowCoordinatePosition,
} from '@/hooks/useMenu'
import { removeNodeAdsorption } from '@/hooks/useAdsorption'
import { deleteFlowByName } from '@/hooks/useNodeOfFlow'
import { globalConfigList } from '@/hooks/useGlobalConfig'
import useCanvasManage from '@/hooks/useCanvasManage'

import emitter from '@/utils/emitter'

const {
  onDragOver,
  onDragLeave,
  onNodeDragStart,
  onNodeDragStop,
  addWhenNode,
} = useDragAndDrop()

const { getCurrentCanvas, isShowEditFlag } = useCanvasManage()

const { findNode, removeNodes, screenToFlowCoordinate } = useVueFlow()

const nodeTypes = {
<<<<<<< HEAD
  [NodeType.FLOW]: markRaw(Flow),
  [NodeType.DATABASE]: markRaw(Database),
  [NodeType.WEBSERVICE]: markRaw(WebService),
  [NodeType.LISTENER]: markRaw(Listener),
    [NodeType.CHOICEWHEN]: markRaw(ChoiceWhen),
    [NodeType.CHOICEDEFAULT]: markRaw(ChoiceDefault),
    [NodeType.FOREACH]: markRaw(ForEach),
    [NodeType.SUBFLOW]: markRaw(SubFlow),
    [NodeType.LOGGER]: markRaw(Logger),
    [NodeType.FLOWREFERENCE]: markRaw(FlowReference),
    [NodeType.SETPAYLOAD]: markRaw(SetPayload),
    [NodeType.REQUEST]: markRaw(Request),
>>>>>>> f07de77aa1f29131e5dc6692b5df0df96fb8e8c6
}

function nodeClickHandler(e) {
  console.log('点击节点：', e.node)

function nodeDoubleClickHandler(e) {
  drawerClickNode.value = findNode(e.node.id)
  onNodeDoubleClick()
}

function nodeDragStartHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  canvasMenuVisible.value = false
  onNodeDragStart(e)
}

function nodeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  canvasMenuVisible.value = false
  onNodeContextMenu(e)
}

function edgeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  canvasMenuVisible.value = false
  onEdgeContextMenu(e)
}

function contextMenuHandler(e) {
  const subString = 'vue-flow__container'
  if (!e.target.classList.value.includes(subString)) {
    return
  }
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  canvasMenuVisible.value = false
  menuToFlowCoordinatePosition.value = screenToFlowCoordinate({
    x: e.clientX,
    y: e.clientY,
  })
  onFlowContextMenu(e)
}

watch(
  globalConfigList,
  (newValue, oldValue) => {
    if (isShowEditFlag.value === false) {
      return
    } else {
      var canvas = getCurrentCanvas()
      canvas.isEdited = true
    }
  },
  { deep: true }
)

watch(
  nodes,
  (newValue, oldValue) => {
    if (isShowEditFlag.value === false) {
      return
    } else {
      var canvas = getCurrentCanvas()
      canvas.isEdited = true
    }
  },
  { deep: true }
)

watch(deleteNodeConfirm, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    if (
      deleteNode.value.type == NodeType.FLOW ||
      deleteNode.value.type == NodeType.SUBFLOW
    ) {

      nodes.value.forEach((node, index) => {
        if (
          node.type == NodeType.FLOWREFERENCE &&
          node.data.flowName == deleteNode.value.data.displayName
        ) {
          node.data.flowName = ''
        }
      })
      deleteFlowByName(deleteNode.value.data.displayName)
    }
    removeNodeAdsorption(deleteNode.value.id)
    removeNodes(deleteNode.value.id, true, true)
    deleteNode.value = null
    deleteNodeConfirm.value = false
  }
})

emitter.on('addWhenNode', (id) => addWhenNode(id))
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.vue-flow__minimap {
  -webkit-transform: scale(75%);
  -ms-transform: scale(75%);
  transform: scale(75%);
  -webkit-transform-origin: bottom right;
  -ms-transform-origin: bottom right;
  transform-origin: bottom right;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.vue-flow-wrapper {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  height: 100%;
}
</style>
