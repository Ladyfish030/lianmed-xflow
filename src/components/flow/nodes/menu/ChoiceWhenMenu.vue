<template>
    <div class="container">
        <div @click="pasteHandler" class="button-container">
            <PasteIcon />
            <span>粘贴</span>
        </div>
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
    menuClickNode,
    deleteNode,
    deleteNodeHandler,
    pasteNodeHandler,
} from '@/hooks/useMenu'
import PasteIcon from '@/assets/svg/PasteIcon.vue'

function deleteHandler() {
    deleteNode.value = menuClickNode.value
    deleteNodeHandler()
}

function pasteHandler() {
    pasteNodeHandler()
}
</script>

<style scoped>
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

.el-icon {
    margin-left: 5px;
}
</style>