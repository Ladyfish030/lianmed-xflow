<template>
    <div class="container">
        <div @click="pasteHandler" class="button-container">
            <PasteIcon />
            <span>粘贴</span>
        </div>
    </div>
</template>

<script setup>
import {
    pasteNodeHandler,
} from '@/hooks/useMenu'
import PasteIcon from '@/assets/svg/PasteIcon.vue'

function pasteHandler() {
    pasteNodeHandler()
}
</script>

<style scoped>
.container {
    height: 90%;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 5px;
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
    width: 90%;
    border-radius: 3px;
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