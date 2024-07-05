<template>
    <el-dialog 
        v-model="addGlobalConfigDialogVisible" 
        title="选择配置类别" 
        width="300" 
        top="10vh"
        :close-on-click-modal="false" 
        :append-to-body="true" 
        style="height: 400px;">
        <button class="tool-button" @click="showConfigDialogHandler(GlobalConfigTypeInGeneral.DATABASE_CONFIG)">
            <div class="tool-button-content">
                <DatabaseIcon style="height: 15px; width: 15px" />
                <el-text style="margin-left: 5px;">Database</el-text>
            </div>
        </button>
        <button class="tool-button" @click="showConfigDialogHandler(GlobalConfigTypeInGeneral.LISTENER_CONFIG)">
            <div class="tool-button-content">
                <ListenerIcon style="height: 15px; width: 15px" />
                <el-text style="margin-left: 5px;">Listener</el-text>
            </div>
        </button>
        <button class="tool-button" @click="showConfigDialogHandler(GlobalConfigTypeInGeneral.REQUEST_CONFIG)">
            <div class="tool-button-content">
                <RequestIcon style="height: 15px; width: 15px" />
                <el-text style="margin-left: 5px;">Request</el-text>
            </div>
        </button>
    </el-dialog>

    <DatabaseConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.DATABASE_CONFIG && configDialogVisible" />
    <ListenerConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.LISTENER_CONFIG && configDialogVisible" />
    <RequestConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.REQUEST_CONFIG && configDialogVisible" />
</template>

<script setup>
import { ref } from 'vue'
import {
    addGlobalConfigDialogVisible,
    configDialogVisible,
    currentConfigForm,
    isAddConfig,
} from '@/hooks/useGlobalConfig'

import DatabaseIcon from '@/assets/svg/DatabaseIcon.vue'
import ListenerIcon from '@/assets/svg/ListenerIcon.vue'
import RequestIcon from '@/assets/svg/RequestIcon.vue'

import DatabaseConfigDialog from '@/components/DatabaseConfigDialog.vue'
import ListenerConfigDialog from '@/components/ListenerConfigDialog.vue'
import RequestConfigDialog from '@/components/RequestConfigDialog.vue'

import * as GlobalConfigForm from "@/components/global_config/attribute/GlobalConfigForm.js"
import { GlobalConfigTypeInGeneral } from '@/enums/GlobalConfigTypeInGeneral'

const selectedConfigType = ref(null)

function showConfigDialogHandler(configType) {
    selectedConfigType.value = configType
    console.log("selectedConfigType.value:", selectedConfigType.value)
    switch (configType) {
        case GlobalConfigTypeInGeneral.DATABASE_CONFIG:
            Object.keys(currentConfigForm).forEach(key => {
                delete currentConfigForm[key]
            })
            Object.assign(currentConfigForm, { ...GlobalConfigForm.MySqlConfig })
            isAddConfig.value = true
            break
        case GlobalConfigTypeInGeneral.LISTENER_CONFIG:
            Object.keys(currentConfigForm).forEach(key => {
                delete currentConfigForm[key]
            })
            Object.assign(currentConfigForm, { ...GlobalConfigForm.ListenerConfig })
            isAddConfig.value = true
            break
        case GlobalConfigTypeInGeneral.REQUEST_CONFIG:
            Object.keys(currentConfigForm).forEach(key => {
                delete currentConfigForm[key]
            })
            Object.assign(currentConfigForm, { ...GlobalConfigForm.RequestConfig })
            isAddConfig.value = true
    }
    configDialogVisible.value = true
}
</script>

<style scoped>
.tool-button {
  border-radius: 5px;
  border-color: transparent;
  background-color: transparent;
  height: 25px;
  width: 100px;
  margin-bottom: 5px;
  display: flex;
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

.tool-button-content {
    margin-left: 5px;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
</style>