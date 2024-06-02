<template>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
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
        <Share />
      </el-icon>
      <template #title>
        <span>Flow</span>
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

<script lang="ts">
export default {
  name: 'BaseSide',
}
</script>

<script lang="ts" setup>
import { ref } from 'vue'

const isCollapse = ref(true)
function ExpandOrFoldClickHandle() {
  isCollapse.value = !isCollapse.value
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
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
  width: 100px;
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
  display: flex;
}

.expand-or-fold-button:hover {
  display: block;
  background-color: white;
}
</style>
