<template>
    <el-container class="config-container">
        <el-header class="config-header">
            <div class="header-container">
                <FamilyTreeHeader />
            </div>
        </el-header>
        <el-main class="config-main">
            <div class="main-container">
                <FamilyTreeMain />
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import FamilyTreeHeader from '@/components/family_tree/FamilyTreeHeader.vue';
import FamilyTreeMain from '@/components/family_tree/FamilyTreeMain.vue';
</script>

<style scoped>
.config-container {
  height: 100%;
  width: 100%;
}

.config-header {
    --el-header-padding: 0 0px;
    padding: 10px 10px 0px 10px;
    height: 45px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #fafafa;
}

.header-container {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid white;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: block;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: white;
}

.config-main {
    height: 100%;
    width: 100%;
    --el-main-padding: 0px;
    background-color: #fafafa;
    padding: 10px 10px 10px 10px;
}

.main-container {
    width: 100%;
    height: 100%;
    border: 1px solid white;
    border-radius: 10px;
    -webkit-box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin-top: 0px;
    background-color: white;
}
</style>