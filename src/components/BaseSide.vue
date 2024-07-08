<template>
  <el-menu
    default-active="home"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    :router="true"
  >
    <el-menu-item index="home">
      <el-icon>
        <House />
      </el-icon>
      <template #title>
        <span>主页</span>
      </template>
    </el-menu-item>
    <el-menu-item index="flow">
      <el-icon>
        <FlowMenuIcon />
      </el-icon>
      <template #title>
        <span>Flow</span>
      </template>
    </el-menu-item>
    <el-menu-item index="global_config">
      <el-icon>
        <GlobalConfigMenuIcon />
      </el-icon>
      <template #title>
        <span>全局配置</span>
      </template>
    </el-menu-item>
    <div class="button-container">
      <el-button
        @click="ExpandOrFoldClickHandle"
        class="expand-or-fold-button"
        style="display: block"
      >
        <el-icon v-if="isCollapse">
          <Expand />
        </el-icon>
        <el-icon v-else>
          <Fold />
        </el-icon>
      </el-button>
    </div>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue'
import FlowMenuIcon from '@/assets/svg/FlowMenuIcon.vue'
import GlobalConfigMenuIcon from '@/assets/svg/GlobalConfigMenuIcon.vue'

const isCollapse = ref(true)
function ExpandOrFoldClickHandle() {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped>
.el-menu-vertical-demo {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: fit-content;
  min-height: 400px;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.button-container {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.expand-or-fold-button {
  width: 100%;
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  border-radius: 0px;
  border-width: 1px 0 0 0;
}

.expand-or-fold-button:hover {
  display: block;
  background-color: white;
  border-top-color: #dedfe0;
}
</style>