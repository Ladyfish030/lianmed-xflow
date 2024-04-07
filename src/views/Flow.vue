<template>
  <div class="dndflow" @drop="onDrop">
    <FlowSide />
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @connect="addEdge"
      @node-double-click="nodeClickHandler"
      @edge-click="edgeClick"
      @node-drag-stop="nodeDragStop"
      @node-context-menu="nodeContextMenu"
      :zoomOnDoubleClick="false"
    >
      <DropzoneBackground />
      <MiniMap pannable />
      <Controls position="top-right" />

      <template #[`node-${node.type}`] v-for="node in nodes" :key="node.id">
        <component
          :is="getCustomNodeComponent(node.type)"
          :node="node"
        />
      </template>
    </VueFlow>
  </div>
  <FlowDrawer />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import FlowSide from '../components/FlowSide.vue'
import FlowDrawer from '../components/FlowDrawer.vue'

import Database from '@/components/nodes/Database.vue'
import WebService from '@/components/nodes/WebService.vue'
import Choice from '@/components/nodes/Choice.vue'
import ChoiceWhen from '@/components/nodes/ChoiceWhen.vue'
import ChoiceDefault from '@/components/nodes/ChoiceDefault.vue'
import ForEach from '@/components/nodes/ForEach.vue'

import { NodeType } from '../enums/NodeType'
import useDragAndDrop from '../hooks/useDnD'
import { nodeClickHandler } from '../hooks/useDrawer'
import { edgeClick, addEdge, edges } from '../hooks/useEdge'
import { nodeContextMenu } from '../hooks/useNode'

const { onDragOver, onDrop, onDragLeave, nodes, nodeDragStop } = useDragAndDrop()
// let parentNodePosition = []
// let nodesLen = nodes.value.length //用来记录之前node的个数，以此判断销毁组件的时候是重新渲染还是删除事件

// function deleteNode(e) {
//   console.log("删除了一个节点")
//   if (nodes.value.length < nodesLen) {
//     for (let i = 0, len = parentNodePosition; i < len; i++) {
//       if (parentNodePosition[i].id == e) {
//         parentNodePosition.remove(i)
//         break
//       }
//     }
//     nodesLen = nodes.value.length
//   }
// }

function getCustomNodeComponent(type) {
  switch (type) {
    case NodeType.DATABASE:
      return Database
    case NodeType.WEBSERVICE:
      return WebService
    case NodeType.CHOICE:
      return Choice
    case NodeType.CHOICEWHEN:
      return ChoiceWhen
    case NodeType.CHOICEDEFAULT:
      return ChoiceDefault
    case NodeType.FOREACH:
      return ForEach
    default:
      return null
  }
}

// function addNode(e) {
//   parentNodePosition = []
//   for (let item of nodes.value) {
//     if (item.type == NodeType.CHILDFLOW || item.type == NodeType.FOREACH) {
//       let pos = {
//         xMin: item.position.x,
//         xMax: item.position.x + item.dimensions.width,
//         yMin: item.position.y,
//         yMax: item.position.y + item.dimensions.height,
//         id: item.id,
//       }
//       parentNodePosition.push(pos)
//     }
//   }
//   onDrop(e)
//   nodeDragStop(nodes.value[nodes.value.length - 1])
//   nodesLen = nodes.value.length
// }
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
