<script setup>
import { ref, reactive } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import DropzoneBackground from '../components/DropzoneBackground.vue'
import FlowSide from '../components/FlowSide.vue'
import useDragAndDrop from '../hooks/useDnD'
import {
  nodeClickHandler,
  drawer,
  handleClose,
  propertyList,
  nodePropertyChange,
} from '../hooks/useDrawer'

const { onConnect, addEdges } = useVueFlow()

const { onDragOver, onDrop, onDragLeave, isDragOver, nodeList } =
  useDragAndDrop()
const flow = ref(null)
// const nodes = ref([
//   { id: '1', type: 'input', label: 'node', position: { x: 250, y: 0 } },
//   {
//     id: '2',
//     label: 'parent node',
//     position: { x: 100, y: 100 },
//     style: {
//       backgroundColor: 'rgba(16, 185, 129, 0.5)',
//       width: '200px',
//       height: '200px',
//     },
//   },
//   {
//     id: '2a',
//     label: 'child node',
//     position: { x: 10, y: 50 },
//     parentNode: '2',
//   },
//   {
//     id: '4',
//     label: 'parent node',
//     position: { x: 320, y: 175 },
//     style: {
//       backgroundColor: 'rgba(16, 185, 129, 0.5)',
//       width: '400px',
//       height: '300px',
//     },
//   },
//   {
//     id: '4a',
//     label: 'child node',
//     position: { x: 15, y: 65 },
//     extent: 'parent',
//     parentNode: '4',
//   },
//   {
//     id: '4b',
//     label: 'nested parent node',
//     position: { x: 15, y: 120 },
//     style: {
//       backgroundColor: 'rgba(139, 92, 246, 0.5)',
//       height: '150px',
//       width: '270px',
//     },
//     parentNode: '4',
//   },
//   {
//     id: '4b1',
//     label: 'nested child node',
//     position: { x: 20, y: 40 },
//     parentNode: '4b',
//   },
//   {
//     id: '4b2',
//     label: 'nested child node',
//     position: { x: 100, y: 100 },
//     parentNode: '4b',
//   },
//   {
//     id: '4c',
//     label: 'child node',
//     position: { x: 200, y: 65 },
//     parentNode: '4',
//   },
//   {
//     id: '999',
//     type: 'input',
//     label: 'Drag me to extend area!',
//     position: { x: 20, y: 100 },
//     class: 'light',
//     expandParent: true,
//     parentNode: '2',
//   },
// ])

// const edges = ref([
//   { id: 'e1-2', source: '1', target: '2' },
//   { id: 'e1-4', source: '1', target: '4' },
//   { id: 'e1-4c', source: '1', target: '4c' },
//   { id: 'e2a-4a', source: '2a', target: '4a' },
//   { id: 'e4a-4b1', source: '4a', target: '4b1' },
//   { id: 'e4a-4b2', source: '4a', target: '4b2' },
//   { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
// ])
const nodes = ref([])
const edges = ref([])
Object.assign(nodes, nodeList)
onConnect(addEdges)
function test() {
  //获得当前画布上所有的节点和线，到时候把这个传递给后端
  console.log('====================================')
  console.log('test')
  console.log('====================================')
  console.log('====================================')
  console.log(flow.value.getEdges)
  console.log('====================================')
  console.log(flow.value.getNodes)
}
function edgeClick(e) {
  e.edge.label = 'y'
}
</script>

<template>
  <div class="dndflow" @drop="onDrop">
    <FlowSide @click="test" />
    <VueFlow
      ref="flow"
      :nodes="nodes"
      :edges="edges"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @nodeClick="nodeClickHandler"
      @edgeClick="edgeClick"
    >
      <DropzoneBackground
        :style="{
          backgroundColor: isDragOver ? '#e7f3ff' : 'transparent',
          transition: 'background-color 0.2s ease',
        }"
      />
    </VueFlow>
  </div>
  <el-drawer
    v-model="drawer"
    title="组件属性配置"
    direction="rtl"
    :before-close="handleClose"
    class="my-drawer"
  >
    <el-input
      v-for="(index, item) in propertyList"
      v-model="propertyList[item]"
      @input="nodePropertyChange"
      placeholder="请输入内容"
    >
      <template #prepend>{{ item }}</template>
    </el-input>
  </el-drawer>
</template>
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
<style>
.my-drawer {
  line-height: 50px;
}
.el-drawer__body {
  border-top: black solid 1px;
}
.el-drawer__title {
  font-weight: bold;
  font-size: 25px;
}
</style>
