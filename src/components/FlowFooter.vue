<template>
    <div class="scrollbar-container">
        <el-scrollbar>
            <div class="segmented-container">
                <el-segmented size="small" v-model="value" :options="options" @contextmenu.prevent>
                    <template #default="{ item }">
                        <div @contextmenu.prevent="(e) => canvasContextMenuHandler(e, item)">
                            {{ item }}
                        </div>
                    </template>
                </el-segmented>
            </div>
        </el-scrollbar>
    </div>
    <el-tooltip content="新建画布" placement="top" effect="dark">
        <el-button class="add-canvas-button">
            <el-icon color="black" size="18px">
                <Plus />
            </el-icon>
        </el-button>
    </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
import { onCanvasContextMenu } from '../hooks/useMenu'

const value = ref('Delicacy')

const options = ['新建画布1', '新建画布2', '新建画布3', '新建画布4', '新建画布5', '新建画布6', '新建画布7', '新建画布8', '新建画布9', '新建画布10', '新建画布11', '新建画布12', '新建画布13', '新建画布14', '新建画布15', '新建画布16']

function canvasContextMenuHandler(event, item) {
    onCanvasContextMenu(event, item)
}
</script>

<style scoped>
.scrollbar-container {
    margin-top: 3px;
    height: 100%;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    max-width: 96%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.segmented-container {
    margin-top: 4px;
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.el-segmented {
    font-size: 13px;
    background-color: white;
    --el-segmented-item-selected-color: var(--el-text-color-primary);
    --el-segmented-item-selected-bg-color: #c6e2ff;
    --el-border-radius-base: 8px;
}

.add-canvas-button {
    border-width: 0px;
    width: 25px;
}

.add-canvas-button:hover {
    background-color: #e9e9eb;
}
</style>
