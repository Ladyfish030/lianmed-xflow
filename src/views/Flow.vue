<template>
  <div class="dndflow" @drop="onDrop">
    <el-container class="flow-container">
      <el-aside class="flow-side"><FlowSide /></el-aside>
      <el-container class="flow-container">
        <el-header class="flow-header">
          <div class="header-container">
            <FlowHeader />
          </div>
        </el-header>
        <el-main class="flow-main">
          <div class="vueflow-container">
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
          @click="clickHandler" 
          @dblclick="doubleClickHandler"
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
          <FlowDrawer />
        </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import FlowSide from '../components/FlowSide.vue'
import FlowHeader from '../components/FlowHeader.vue'
import FlowDrawer from '../components/FlowDrawer.vue'
import FlowNodeMenu from '@/components/FlowNodeMenu.vue'
import FlowEdgeMenu from '@/components/FlowEdgeMenu.vue'
import FlowMenu from '@/components/FlowMenu.vue'

import Database from '@/components/nodes/Database.vue'
import WebService from '@/components/nodes/WebService.vue'
import Choice from '@/components/nodes/Choice.vue'
import ChoiceWhen from '@/components/nodes/ChoiceWhen.vue'
import ChoiceDefault from '@/components/nodes/ChoiceDefault.vue'
import ForEach from '@/components/nodes/ForEach.vue'
import SubFlow from '@/components/nodes/SubFlow.vue'
import Logger from '@/components/nodes/Logger.vue'
import FlowReference from '@/components/nodes/FlowReference.vue'

import { NodeType } from '../enums/NodeType'
import useDragAndDrop from '../hooks/useDnD'
import { onNodeDoubleClick, drawerClickNode } from '../hooks/useDrawer'
import { onConnect, edges } from '../hooks/useEdge'
import { nodes } from '../hooks/useNode'
import {
  onNodeContextMenu,
  onEdgeContextMenu,
  onFlowContextMenu,
  nodeMenuVisible,
  edgeMenuVisible,
  flowMenuVisible,
  deleteNode,
  deleteNodeConfirm,
  menuToFlowCoordinatePosition,
} from '../hooks/useMenu'
import { removeNodeAdsorption } from '../hooks/useAdsorption'
import emitter from '@/utils/emitter'

const {
  onDragOver,
  onDrop,
  onDragLeave,
  onNodeDragStart,
  onNodeDragStop,
  addWhenNode,
} = useDragAndDrop()

const { findNode, removeNodes, screenToFlowCoordinate } = useVueFlow()

const nodeTypes = {
  [NodeType.DATABASE]: markRaw(Database),
  [NodeType.WEBSERVICE]: markRaw(WebService),
  [NodeType.CHOICE]: markRaw(Choice),
  [NodeType.CHOICEWHEN]: markRaw(ChoiceWhen),
  [NodeType.CHOICEDEFAULT]: markRaw(ChoiceDefault),
  [NodeType.FOREACH]: markRaw(ForEach),
  [NodeType.SUBFLOW]: markRaw(SubFlow),
  [NodeType.LOGGER]: markRaw(Logger),
  [NodeType.FLOWREFERENCE]: markRaw(FlowReference),
}

function nodeClickHandler(e) {
  console.log("点击节点：", e.node)
}

function nodeDoubleClickHandler(e) {
  drawerClickNode.value = findNode(e.node.id)
  onNodeDoubleClick()
}

function nodeDragStartHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  onNodeDragStart(e)
}

function nodeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  onNodeContextMenu(e)
}

function edgeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  onEdgeContextMenu(e)
}

function clickHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
}

function doubleClickHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
}

function contextMenuHandler(e) {
  const subString = "vue-flow__container"
  if (!e.target.classList.value.includes(subString)) {
    return
  }
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  menuToFlowCoordinatePosition.value = screenToFlowCoordinate({
    x: e.clientX,
    y: e.clientY,
  })
  onFlowContextMenu(e)
}

watch(deleteNodeConfirm, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
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

.flow-container {
  height: 100%;
}
.flow-header {
  --el-header-padding: 0 0px;
  height: 56px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background-color: #fafafa;
}
.header-container {
  width: 99%;
  height: 65%;
  border: 1px solid white; 
  border-radius: 10px;
  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
  display: -webkit-box; 
  display: -ms-flexbox; 
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 0px;
  margin-right: auto;
  background-color: white
}
.flow-side {
  --el-side-padding: 0 0px;
  width: 240px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: #fafafa;
}

.flow-main {
  --el-main-padding: 0px;
}
.vueflow-container {
  width: 99%;
  height: 98.4%;
  border: 1px solid white; 
  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); 
  display: -webkit-box; 
  display: -ms-flexbox; 
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-top: 0px;
}
.divider {
  margin: 0px;
}

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

.dndflow {
  height: 100%;
  width: 100%;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  margin: 0;
  font-family: 'Microsoft YaHei';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.dndflow .vue-flow-wrapper {
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  height: 100%;
}

@media screen and (min-width: 640px) {
  .dndflow {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
  }

  .dndflow aside {
    min-width: 15%;
  }
}

@media screen and (max-width: 639px) {
  .dndflow aside .nodes {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -ms-flex-direction: row;
    flex-direction: row;
    gap: 5px;
  }
}
</style>
