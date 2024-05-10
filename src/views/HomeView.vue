<script setup lang="ts">
import BaseHeader from '../components/BaseHeader.vue'
import BaseSide from '../components/BaseSide.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="base-header">
        <base-header></base-header>
      </el-header>
      <el-container>
        <el-aside class="base-side">
          <base-side></base-side>
        </el-aside>
        <el-main class="base-main"><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.base-header {
  --el-header-padding: 0 0px;
}
.base-side {
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  --el-side-padding: 0 0px;
}
.base-main {
  --el-main-padding: 0px;
}
</style>