<template>
  <div class="dndflow" @drop="onDrop" @click="clickHandler">
    <el-container class="flow-container">
      <el-aside class="flow-side">
        <FlowSide />
      </el-aside>
      <el-container class="flow-container">
        <el-header class="flow-header">
          <div class="header-container">
            <FlowHeader />
          </div>
        </el-header>
        <el-main class="flow-main">
          <div v-show="haveCanvas" class="main-container">
            <FlowMain />
          </div>
        </el-main>
        <el-footer class="flow-footer">
          <div class="footer-container">
            <FlowFooter />
          </div>
        </el-footer>
      </el-container>
    </el-container>
    <FlowDrawer />
    <FlowFooterMenu />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FlowSide from '@/components/flow/FlowSide.vue'
import FlowHeader from '@/components/flow/FlowHeader.vue'
import FlowMain from '@/components/flow/FlowMain.vue'
import FlowFooter from '@/components/flow/FlowFooter.vue'
import FlowDrawer from '@/components/flow/FlowDrawer.vue'
import FlowFooterMenu from '@/components/flow/FlowFooterMenu.vue'

import useDragAndDrop from '@/hooks/useDnD'
import {
  nodeMenuVisible,
  edgeMenuVisible,
  flowMenuVisible,
  canvasMenuVisible,
} from '@/hooks/useMenu'
import useCanvasManage from '@/hooks/useCanvasManage'

const { onDrop } = useDragAndDrop()
const { canvasList } = useCanvasManage()
const haveCanvas = computed(() => {
  return canvasList.value.length != 0
})

function clickHandler(e) {
  nodeMenuVisible.value = false
  edgeMenuVisible.value = false
  flowMenuVisible.value = false
  canvasMenuVisible.value = false
}
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.flow-container {
  height: 100%;
  width: 100%;
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
  position: relative;
  width: 99%;
  height: 65%;
  border: 1px solid white;
  border-radius: 10px;
  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: -webkit-box;
  display: -ms-flexbox;
  display: block;
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
  background-color: white;
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
  height: 100%;
  width: 100%;
  --el-main-padding: 0px;
  background-color: #fafafa;
}

.main-container {
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

.flow-footer {
  --el-footer-padding: 0px;
  height: 47px;
  width: 100%;
  background-color: #fafafa;
}

.footer-container {
  width: 99%;
  height: 37px;
  border: 1px solid white;
  border-radius: 10px;
  -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 0px;
  margin-right: auto;
  background-color: white;
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
