<template>
    <div v-if="canvasMenuVisible" class="menu-container" :style="{ left: menuPosition.x + 'px', top: '630px' }">
        <div @click="deleteHandler" class="button-container">
            <el-icon :size="20" color="#f89898">
                <Delete />
            </el-icon>
            <span style="color: #f89898;">删除</span>
        </div>
    </div>
</template>

<script setup>
import {
    canvasMenuVisible,
    deleteCanvas,
    menuClickCanvas,
    menuPosition,
} from '@/hooks/useMenu'
import useCanvasManage from '@/hooks/useCanvasManage'

const { deleteCanvasByIndex, getCanvasByIndex } = useCanvasManage()

function deleteHandler() {
    deleteCanvas.value = menuClickCanvas.value
    const canvas = getCanvasByIndex(deleteCanvas.value)
    if (canvas.isEdited === true) {
        ElMessageBox.confirm('确定关闭该画布？请注意保存', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    })
        .then(() => {
            deleteCanvasByIndex(deleteCanvas.value)
        })
        .catch(() => {

        })
    }
    else {
        deleteCanvasByIndex(deleteCanvas.value)
    }
}
</script>

<style scoped>
.menu-container {
    position: absolute;
    width: 150px;
    border: 1px solid #e9e9eb;
    border-radius: 5px;
    background-color: white;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    z-index: 1000;
}

.container {
    height: 90%;
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.button-container {
    height: 25px;
    width: 90%;
    border-radius: 3px;
    margin-top: 3px;
    margin-bottom: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: left;
    -ms-flex-pack: left;
    justify-content: left;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.button-container:hover {
    background-color: #f4f4f5;
    cursor: pointer;
}

.button-container>span {
    margin-left: 5px;
    line-height: 100%;
}
</style>