<template>
  <div class="dndflow" @drop="addNode">
    <FlowSide />
    <VueFlow v-model:nodes="nodes" 
    @dragover="onDragOver" 
    @dragleave="onDragLeave" 
    @nodeClick="nodeClickHandler" 
    @edgeClick="edgeClick" 
    @node-drag-stop="nodeDragStop($event.nodes[0])"
    >     
      <DropzoneBackground />
      <MiniMap pannable />
      <Controls position="top-right" />

      <template #[`node-${node.type}`] v-for="node in nodes" :key="node.id">
        <component
          :is="getCustomNodeComponent(node.type)"
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
import ConditionalBranch from '@/components/nodes/ConditionalBranch.vue'
import ForEach from '@/components/nodes/ForEach.vue'
import useDragAndDrop from '../hooks/useDnD'
import { nodeClickHandler } from '../hooks/useDrawer'
import { NodeType } from '../enums/NodeType'
import { edgeUpdate,edgeClick } from "../hooks/useEdge";

const { onConnect, addEdges } = useVueFlow()
const { onDragOver, onDrop, onDragLeave, nodes } = useDragAndDrop()
const parentNodePosition = reactive([])

function getCustomNodeComponent(type) {
  switch (type) {
    case NodeType.DATABASE:
      return Database
    case NodeType.WEBSERVICE:
      return WebService
    case NodeType.CONDITIONALBRANCH:
      return ConditionalBranch
    case NodeType.FOREACH:
      return ForEach
    default:
      return null
  }
}
function addNode(e) {
  console.log(nodes.value);
  for (let item of nodes.value) {
    if (item.type == NodeType.CHILDFLOW || item.type == NodeType.FOREACH) {
      let pos = {
        xMin: item.position.x,
        xMax: item.position.x + item.dimensions.width,
        yMin: item.position.y,
        yMax: item.position.y + item.dimensions.height,
        id: item.id,
      }
      parentNodePosition.push(pos)
    }
  }
  onDrop(e)
  nodeDragStop(nodes.value[nodes.value.length - 1])
}
function nodeDragStop(node) {
  console.log(parentNodePosition);
  console.log('nodeDragStop');
  let { x, y } = node.position
  for (let item of parentNodePosition) {
    if (x >= item.xMin && x <= item.xMax && y >= item.yMin && y <= item.yMax) {
      node.parentNode = item.id
    }
  }
}
onConnect(addEdges)
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
  text-transform: uppercase;
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