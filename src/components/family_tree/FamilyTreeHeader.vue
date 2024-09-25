<template>
    <div class="button-container">
        <el-tooltip content="导出家系图为图片" placement="bottom" effect="dark" :hide-after="0">
        <button class="tool-button" @click="doScreenshotHandler()">
          <ExportAsImageIcon />
        </button>
      </el-tooltip>
      
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { isScreenshotClicked } from '@/hooks/family_tree/useScreenshot'

import ExportAsImageIcon from '@/assets/svg/family_tree/ExportAsImageIcon.vue'

function doScreenshotHandler() {
  isScreenshotClicked.value = true
}
</script>

<style scoped>
.button-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    margin-left: 5px;
    margin-right: auto;
    height: 100%;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    border-color: transparent;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.tool-button {
    margin-left: 8px;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    height: 25px;
    width: 25px;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.tool-button:hover {
    -webkit-transform: scale(105%);
    -ms-transform: scale(105%);
    transform: scale(105%);
    -webkit-transition: 0.25s all ease-in-out;
    -o-transition: 0.25s all ease-in-out;
    transition: 0.25s all ease-in-out;
    cursor: pointer;
    background-color: #e9e9eb;
}
</style>