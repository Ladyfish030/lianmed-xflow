<script setup lang="ts">
import BaseHeader from '../components/BaseHeader.vue'
import BaseSide from '../components/BaseSide.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <base-header></base-header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <base-side></base-side>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped></style>
