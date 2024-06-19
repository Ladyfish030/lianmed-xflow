<template>
    <el-scrollbar>
        <div class="scrollbar-flex-content">
            <el-tooltip v-for="(item, index) in canvasList" 
                :key="index"  
                :content="item.name" 
                placement="top" 
                effect="light" 
                :hide-after="0"
            >
                <el-button 
                    class="scrollbar-item"
                    :class="{ 'active-item': index === currentCanvasIndex }" 
                    :disabled="isSwitchingCanvas"
                    @click.prevent="switchCanvasHandler(index)"
                    @contextmenu.prevent="(e) => canvasContextMenuHandler(e, index)">
                    <el-text class="scrollbar-item-text" truncated>
                        {{ item.name }}
                    </el-text>
                    <DotIcon v-if="item.isEdited" class="dot"/>
                </el-button>
            </el-tooltip>
        </div>
    </el-scrollbar>

    <el-tooltip content="新建画布" placement="top" effect="dark" :hide-after="0">
        <el-button class="add-canvas-button" @click.prevent="createNewCanvasHandler" :disabled="isCreatingCanvas">
            <el-icon color="black" size="18px">
                <Plus />
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onCanvasContextMenu } from '@/hooks/useMenu'
import useCanvasManage from '@/hooks/useCanvasManage'

import DotIcon from '@/assets/svg/DotIcon.vue'

const {
    canvasList,
    currentCanvasIndex,
    createNewCanvas,
    switchCanvas,
} = useCanvasManage()

const isCreatingCanvas = ref(false)
const isSwitchingCanvas = ref(false)

function canvasContextMenuHandler(event, canvasIndex) {
    onCanvasContextMenu(event, canvasIndex)
}

function switchCanvasHandler(index) {
    if (isSwitchingCanvas.value === true) {
        return
    }
    else {
        isSwitchingCanvas.value = true
        switchCanvas(index)
        isSwitchingCanvas.value = false
    }
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
</script>

<style scoped>
.scrollbar-flex-content {
    display: flex;
}

.scrollbar-item {
    flex-shrink: 0;
    display: flex;
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
