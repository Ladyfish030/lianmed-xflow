<template>
  <div class="dndflow" @drop="onDrop">
    <FlowSide />
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @connect="onConnect"
      @node-double-click="nodeDoubleClickHandler"
      @node-drag-start="nodeDragStartHandler"
      @node-drag-stop="onNodeDragStop"
      @node-context-menu="nodeContextMenuHandler"
      @edge-context-menu="edgeContextMenuHandler"
      @click="clickHandler"
      @dblclick="doubleClickHandler"
      @contextmenu.prevent.self
      :zoomOnDoubleClick="false"
      :delete-key-code="null"
    >
      <DropzoneBackground />
      <MiniMap pannable />
      <Controls position="top-right" />
      <FlowNodeMenu />
      <FlowEdgeMenu />
      <SaveRestoreControls></SaveRestoreControls>
    </VueFlow>
    <FlowDrawer />
  </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import SaveRestoreControls from '../components/SaveRestoreControls.vue'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import FlowSide from '../components/FlowSide.vue'
import FlowDrawer from '../components/FlowDrawer.vue'
import FlowNodeMenu from '@/components/FlowNodeMenu.vue'
import FlowEdgeMenu from '@/components/FlowEdgeMenu.vue'

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
  nodeMenuVisible,
  edgeMenuVisible,
  deleteNode,
  deleteNodeConfirm,
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
const { findNode, removeNodes } = useVueFlow()

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

function nodeDoubleClickHandler(e) {
  drawerClickNode.value = findNode(e.node.id)
  onNodeDoubleClick()
}

function nodeDragStartHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  onNodeDragStart(e)
}

function nodeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  onNodeContextMenu(e)
}

function edgeContextMenuHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  onEdgeContextMenu(e)
}

function clickHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
}

function doubleClickHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
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
    min-width: 25%;
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
