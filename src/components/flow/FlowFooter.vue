<template>
    <el-scrollbar>
        <div class="scrollbar-flex-content">
            <el-tooltip v-for="(item, index) in canvasList" :key="index" :content="item.name" placement="top"
                effect="light" :hide-after="0">
                <el-button class="scrollbar-item" :class="{ 'active-item': index === currentCanvasIndex }"
                    :disabled="isSwitchingCanvas" @click.prevent="switchCanvasHandler(index)"
                    @contextmenu.prevent="(e) => canvasContextMenuHandler(e, index)">
                    <el-text class="scrollbar-item-text" truncated>
                        {{ item.name }}
                    </el-text>
                    <DotIcon v-if="item.isEdited" class="dot" />
                </el-button>
            </el-tooltip>
        </div>
    </el-scrollbar>

    <el-popover 
        v-model:visible="tipsVisible"
        :disabled="tipsDisabled"
        placement="top-start" 
        title="提示" 
        :width="200" 
        :hide-after="0"
        content="点击这里新建业务流吧！"
        @hide="tipsHideHandler"
        trigger="click"
    >
        <template #reference>
            <div class="add-canvas-button-container">
                <el-tooltip content="新建画布" placement="top" effect="dark" :hide-after="0">
                    <el-button class="add-canvas-button" @click.prevent="createNewCanvasHandler"
                        :disabled="isCreatingCanvas">
                        <el-icon color="black" size="18px">
                            <Plus />
                        </el-icon>
                    </el-button>
                </el-tooltip>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onCanvasContextMenu } from '@/hooks/useMenu'
import useCanvasManage from '@/hooks/useCanvasManage'

import DotIcon from '@/assets/svg/DotIcon.vue'

const {
    canvasList,
    currentCanvasIndex,
    isShowEditFlag,
    createNewCanvas,
    switchCanvas,
} = useCanvasManage()

const tipsVisible = ref(true)
const tipsDisabled = ref(false)

const isCreatingCanvas = ref(false)
const isSwitchingCanvas = ref(false)

function canvasContextMenuHandler(event, canvasIndex) {
    onCanvasContextMenu(event, canvasIndex)
}

function switchCanvasHandler(index) {
    isShowEditFlag.value = false
    if (isSwitchingCanvas.value === true) {
        return
    }
    else {
        isSwitchingCanvas.value = true
        switchCanvas(index)
        isSwitchingCanvas.value = false
    }
    setTimeout(() => {
        isShowEditFlag.value = true
    }, 100)
}

function createNewCanvasHandler() {
    if (isCreatingCanvas.value === true) {
        return
    }
    else {
        isCreatingCanvas.value = true
        createNewCanvas()
        isCreatingCanvas.value = false
    }
}

function tipsHideHandler() {
    tipsVisible.value = false
    tipsDisabled.value = true
}
</script>

<style scoped>
.scrollbar-flex-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.scrollbar-item {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    position: relative;
    width: 120px;
    height: 25px;
    margin: 5px 3px 0 0;
    border-radius: 4px;
    border-color: transparent;
    background-color: #e9e9eb;
}

.scrollbar-item:hover {
    background-color: #c8c9cc;
}

.scrollbar-item.active-item {
    background-color: #c6e2ff;
}

.scrollbar-item-text {
    width: 90px;
    font-size: 12px;
    color: #363636;
}

.add-canvas-button-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 100%;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}

.add-canvas-button {
    border-width: 0px;
    width: 25px;
}

.add-canvas-button:hover {
    background-color: #e9e9eb;
}

.dot {
    position: absolute; 
    right: 5px;
}
</style>
