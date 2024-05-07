<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref, computed } from 'vue'
import useDragAndDrop from '../hooks/useDnD'
import { NodeType } from '../enums/NodeType'

const { onDragStart } = useDragAndDrop()
const searchContent = ref('')
const isSearch = ref(false)
const searchResult = ref(null)

const nodeComponents = [
  { type: NodeType.DATABASE, label: 'Database' },
  { type: NodeType.WEBSERVICE, label: 'WebService' },
  { type: NodeType.CHOICE, label: 'Choice' },
  { type: NodeType.FOREACH, label: 'For Each' },
  { type: NodeType.SUBFLOW, label: 'Sub Flow' },
  { type: NodeType.FLOWREFERENCE, label: 'Flow Reference' },
  { type: NodeType.LOGGER, label: 'Logger' },
]

function filterNode() {
  if (searchContent.value == '') {
    isSearch.value = false
    return
  }
  const searchNode = searchContent.value.toLowerCase()
  isSearch.value = true
  searchResult.value = nodeComponents.filter(item => item.label.toLowerCase().includes(searchNode))
}

function searchClearHandler() {
  isSearch.value = false
}
</script>

<template>
  <div class="component-library-container">
  <div class="component-library">
    <span class="description">组件库</span>
    <el-divider class="divider" />
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
    >
      <div class="input-container">
        <el-input
          v-model="searchContent"
          placeholder="请输入关键字"
          clearable
          :prefix-icon="Search"
          @input="filterNode"
          @clear="searchClearHandler"
        />
      </div>
      <div v-if="isSearch" class="search-result-container">
        <div
          v-for="item in searchResult"
          :key="item.type"
          class="node-container"
        >
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, item.type)"
          >
            <el-icon class="icon"><Grid /></el-icon>{{ item.label }}
          </el-button>
        </div>
      </div>
      <el-sub-menu index="1" v-if="!isSearch">
        <template #title>
          <span class="menu-title">数据源组件</span>
        </template>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.DATABASE)"
          >
            <el-icon><Grid /></el-icon>Database
          </el-button>
        </div>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.WEBSERVICE)"
          >
            <el-icon><Grid /></el-icon>WebService
          </el-button>
        </div>
      </el-sub-menu>
      <el-sub-menu index="2" v-if="!isSearch">
        <template #title>
          <span class="menu-title">逻辑组件</span>
        </template>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.CHOICE)"
          >
            <el-icon><Grid /></el-icon>Choice
          </el-button>
        </div>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.FOREACH)"
          >
            <el-icon><Grid /></el-icon>For Each
          </el-button>
        </div>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.SUBFLOW)"
          >
            <el-icon><Grid /></el-icon>Sub Flow
          </el-button>
        </div>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.FLOWREFERENCE)"
          >
            <el-icon><Grid /></el-icon>Flow Reference
          </el-button>
        </div>
      </el-sub-menu>
      <el-sub-menu index="3" v-if="!isSearch">
        <template #title>
          <span class="menu-title">处理组件</span>
        </template>
        <div class="node-container">
          <el-button 
            class="node" 
            type="info" 
            plain 
            :draggable="true"
            @dragstart="onDragStart($event, NodeType.LOGGER)"
          >
            <el-icon><Grid /></el-icon>Logger
          </el-button>
        </div>
      </el-sub-menu>
    </el-menu>
  </div>
</div>
</template>

<style scoped>
.component-library-container {
  width: 220px;
  height: 97%;
  border: 0px solid white; 
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
  background-color: white;
}
.component-library {
  width: 220px;
  height: 95%;
  margin-top: 0px;
  margin-bottom: auto;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.description {
  height: 45px;
  font-size: 15px;
  color: black;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  position: relative;
  background-color: white;
}
.divider {
  margin: 0px;
  width: 90%;
}
.input-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
.input-container > .el-input {
  --el-input-width: 90%;
  margin-top: 20px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
  min-height: 400px;
  height: 100%; 
  border-right-width: 0px;
}
.menu-title {
  font-size: 13px;
}
.node-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-bottom: 5px;
}
.node {
  width: 80%;
  -webkit-box-pack: left;
  -ms-flex-pack: left;
  justify-content: left;
  padding-left: 0px;
}
.search-result-container {
  margin-top: 20px;
}
.icon {
  font-size: 18px;
  margin-right: 5px;
  margin-left: 3px;
}
</style>
