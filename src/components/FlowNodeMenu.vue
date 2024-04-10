<template>
    <div @click="deleteHandler" class="button-container">
        <el-icon :size="20" color="#f89898">
            <Delete />
        </el-icon>
        <span>删除</span>
    </div>
</template>

<script setup>

function deleteHandler() {

}
</script>

<style scoped>
.button-container {
    width: 100%;
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
}
</style>