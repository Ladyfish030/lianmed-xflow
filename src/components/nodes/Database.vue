<!-- <template>
  <div class="component-container" :style="{ width: `${node.dimensions.width}px`, height: `${node.dimensions.height}px` }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <el-icon size="12px">
      <Coin />
    </el-icon>
    <span class="span-text">Database</span>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { defineProps } from 'vue'

const props = defineProps({
    node: Object
})
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
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
}

.span-text {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  margin-left: 5px;
  font-size: 12px;
  line-height: 100%;
}
</style> -->


<template>
  <div class="component-container" :style="{ width: `${node.dimensions.width}px`, height: `${node.dimensions.height}px` }">
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    <div class="content">
      <el-icon size="20px">
        <Coin />
      </el-icon>
      <span class="span-text">Database</span>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { defineProps } from 'vue'

const props = defineProps({
    node: Object
})
</script>

<style scoped>
.component-container {
  display: flex;
  flex-direction: column; 
  justify-content: center;
  align-items: center;
  border: 1px solid #b1b3b8;
  border-radius: 5px;
  background-color: white;
}

.content {
  display: flex;
  flex-direction: column; 
  align-items: center;
}

.span-text {
  margin-top: 10px; 
  font-size: 10px;
  line-height: 100%;
}
</style>
