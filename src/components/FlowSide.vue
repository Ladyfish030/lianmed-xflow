<script setup>
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'
import useDragAndDrop from '../hooks/useDnD'
import { NodeType } from '../enums/NodeType'

const { onDragStart } = useDragAndDrop()
const input1 = ref('')
</script>

<template>
  <div class="component-library">
    <span class="description">组件库</span>
    <el-divider class="divider" />
    <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
    >
      <div class="input-container">
        <el-input
          v-model="input1"
          placeholder="请输入关键字"
          clearable
          :prefix-icon="Search"
        />
      </div>
      <el-sub-menu index="1">
        <template #title>
          <span class="menu-title">数据源组件</span>
        </template>
        <div
          :draggable="true"
          @dragstart="onDragStart($event, NodeType.DATABASE)"
          class="node-container"
        >
          <el-button class="node" type="info" plain>
            <el-icon><Grid /></el-icon>database
          </el-button>
        </div>
        <div
          :draggable="true"
          @dragstart="onDragStart($event, NodeType.WEBSERVICE)"
          class="node-container"
        >
          <el-button class="node" type="info" plain>
            <el-icon><Grid /></el-icon>webService
          </el-button>
        </div>
      </el-sub-menu>
      <el-sub-menu index="2">
        <template #title>
          <span class="menu-title">逻辑组件</span>
        </template>
        <div
          :draggable="true"
          @dragstart="onDragStart($event, NodeType.CONDITIONALBRANCH)"
          class="node-container"
        >
          <el-button class="node" type="info" plain>
            <el-icon><Grid /></el-icon>条件分支
          </el-button>
        </div>
        <div
          :draggable="true"
          @dragstart="onDragStart($event, NodeType.CHILDFLOW)"
          class="node-container"
        >
          <el-button class="node" type="info" plain>
            <el-icon><Grid /></el-icon>子流程flow
          </el-button>
        </div>
        <div
          :draggable="true"
          @dragstart="onDragStart($event, NodeType.FOREACH)"
          class="node-container"
        >
          <el-button class="node" type="info" plain>
            <el-icon><Grid /></el-icon>for-each
          </el-button>
        </div>
      </el-sub-menu>
      <el-sub-menu index="3">
        <template #title>
          <span class="menu-title">执行组件</span>
        </template>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<style scoped>
.component-library {
  width: 250px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}
.description {
  height: 50px;
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
}
.divider {
  margin: 0px;
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
}
.node {
  margin-bottom: 5px;
  width: 80%;
  -webkit-box-pack: left;
  -ms-flex-pack: left;
  justify-content: left;
  padding-left: 0px;
}
</style>
