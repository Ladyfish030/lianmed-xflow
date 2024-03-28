<template>
  <div class="component-container">
    <Handle :position="Position.Top" />
    <Handle :position="Position.Bottom" />
    <el-icon size="20px">
      <Coin />
    </el-icon>
    <span class="database-text">WebService</span>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
</script>

<style scoped>
.component-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 40px;
  width: 140px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
}

.database-text {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 5px;
}
</style>
