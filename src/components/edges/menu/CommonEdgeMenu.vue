<template>
    <div class="container">
        <div @click="deleteHandler" class="button-container">
            <el-icon :size="20" color="#f89898">
                <Delete />
            </el-icon>
            <span style="color: #f89898;">删除</span>
        </div>
    </div>
</template>

<script setup>
import { menuClickEdge, deleteEdge } from '@/hooks/useMenu'
import { removeEdgeById } from '@/hooks/useEdge'

function deleteHandler() {
    deleteEdge.value = menuClickEdge.value
    removeEdgeById(deleteEdge.value.id)
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