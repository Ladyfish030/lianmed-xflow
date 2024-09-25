<template>
    <el-dialog 
        v-model="nodeInformationDialogVisible" 
        title="具体信息" 
        width="550" 
        top="20vh" 
        draggable
        :append-to-body="true" 
        :modal="false"
        :before-close="handleDialogClose"
    >
        <div class="dialog-content">
            <div class="row-content">
                <span>姓名：</span>
                <el-input v-model="name" style="width: 160px" size="small" placeholder="请输入" clearable />
                <span style="margin-right: 0px; margin-left: auto;">就诊卡号：</span>
                <el-input v-model="medicalCardNumber" style="width: 160px; margin-right: 0px; margin-left: 0px;"
                    size="small" placeholder="请输入" clearable />
            </div>

            <div class="row-content">
                <span>性别：</span>
                <el-radio-group v-model="sex">
                    <el-radio v-if="femaleDisabled" style="margin-right: 26px;" :value=0 size="small">女</el-radio>
                    <el-radio v-if="maleDisabled" style="margin-right: 26px;" :value=1 size="small">男</el-radio>
                    <el-radio :value=2 size="small">未知</el-radio>
                </el-radio-group>
                <span style="margin-right: 0px; margin-left: auto;">疾病情况：</span>
                <el-radio-group style="margin-right: 0px; margin-left: 0px;" v-model="diseaseConditions">
                    <el-radio style="margin-right: 8px;" :value=0 size="small">正常</el-radio>
                    <el-radio style="margin-right: 8px;" :value=1 size="small">患病</el-radio>
                    <el-radio :value=2 size="small">携带者</el-radio>
                </el-radio-group>
            </div>

            <div class="row-content">
                <span>状态：</span>
                <el-radio-group v-model="status">
                    <el-radio style="margin-right: 26px;" :value=0 size="small">存活</el-radio>
                    <el-radio style="margin-right: 26px;" :value=1 size="small">死亡</el-radio>
                </el-radio-group>
            </div>

            <div class="row-content" style="margin-left: 0px;">
                <span>出生日期：</span>
                <el-date-picker 
                    v-model="dateOfBirth" 
                    type="date" 
                    placeholder="请选择日期" 
                    size="small"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    style="width: 160px;" 
                />
                <span style="margin-right: 0px; margin-left: auto;">死亡日期：</span>
                <el-date-picker 
                    v-model="dateOfDeath" 
                    type="date" 
                    placeholder="请选择日期" 
                    size="small"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                    style="width: 160px; margin-right: 0px; margin-left: 0px;" />
            </div>

            <div class="row-content" style="margin-left: 0px;">
                <el-checkbox v-model="isProband" label="先证者" size="small" style="margin-right: 41px;" />
                <el-checkbox v-model="isGeneticOrMedicalExamination" label="遗传学检查/临床检查" size="small" />
                <span style="margin-right: 0px; margin-left: auto;">注释：</span>
                <el-input v-model="annotation" style="width: 160px" size="small" placeholder="请输入" clearable />
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <transition name="fade">
                    <el-button v-if="saveComplete" type="success">
                        <el-icon><Select /></el-icon>
                    </el-button>
                </transition>
                <el-button 
                    type="primary" 
                    @click="saveAttributeWithAnimation"
                    :disabled="isSave === true && saveComplete === false"
                >保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import {
    dialogClickNode,
    nodeInformationDialogVisible,
    haveEdited,
    saveComplete,
} from '@/hooks/family_tree/useDialog'

const { updateNode } = useVueFlow()
const nodeStore = useNodeStore()

const name = ref(dialogClickNode?.value.data.name || '')
const medicalCardNumber = ref(dialogClickNode?.value.data.medicalCardNumber || '')
const sex = ref(dialogClickNode?.value.data.sex || 0)
const diseaseConditions = ref(dialogClickNode?.value.data.diseaseConditions || 0)
const status = ref(dialogClickNode?.value.data.status || 0)
const dateOfBirth = ref(dialogClickNode?.value.data.dateOfBirth || '')
const dateOfDeath = ref(dialogClickNode?.value.data.dateOfDeath || '')
const isProband = ref(dialogClickNode?.value.data.isProband || false)
const isGeneticOrMedicalExamination = ref(dialogClickNode?.value.data.isGeneticOrMedicalExamination || false)
const annotation = ref(dialogClickNode?.value.data.annotation || '')

const isSave = ref(false)
const femaleDisabled = computed(() => {
    if (dialogClickNode.value.mateId !== '') {
        const mate = nodeStore.findNodeById(dialogClickNode.value.mateId)
        if (mate.data.horizontalPosition > dialogClickNode.value.data.horizontalPosition) {
            return false
        }
    }
    return true
})
const maleDisabled = computed(() => {
    if (dialogClickNode.value.mateId !== '') {
        const mate = nodeStore.findNodeById(dialogClickNode.value.mateId)
        if (mate.data.horizontalPosition < dialogClickNode.value.data.horizontalPosition) {
            return false
        }
    }
    return true
})

function saveAttributeWithAnimation() {
    isSave.value = true
    saveComplete.value = false
    updateNode(dialogClickNode.value.id,
        {
            data:
            {
                ...dialogClickNode.value.data,
                name: name.value,
                medicalCardNumber: medicalCardNumber.value,
                sex: sex.value,
                diseaseConditions: diseaseConditions.value,
                status: status.value,
                dateOfBirth: dateOfBirth.value,
                dateOfDeath: dateOfDeath.value,
                isProband: isProband.value,
                isGeneticOrMedicalExamination: isGeneticOrMedicalExamination.value,
                annotation: annotation.value,
            }
        })
    if (isProband.value === true) {
        nodeStore.nodes.forEach(node => {
            if (node.id !== dialogClickNode.value.id) {
                node.data.isProband = false
            }
        })
    }
    saveComplete.value = true
    isSave.value = false
    haveEdited.value = false
    setTimeout(() => {
        saveComplete.value = false
    }, 1000) // 控制动画显示的时间
}

const handleDialogClose = (done) => {
    if (haveEdited.value === true) {
        ElMessageBox.confirm(
            '确定关闭？请注意保存',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        )
            .then(() => {
                nodeInformationDialogVisible.value = false
                dialogClickNode.value = {}
                haveEdited.value = false
                saveComplete.value = false
                done()
            })
            .catch(() => {
                // catch error
            })
    }
    else {
        nodeInformationDialogVisible.value = false
        dialogClickNode.value = {}
        saveComplete.value = false
    }
}

watch([
    name,
    medicalCardNumber,
    sex,
    diseaseConditions,
    status,
    dateOfBirth,
    dateOfDeath,
    isProband,
    isGeneticOrMedicalExamination,
    annotation], ([
        newName,
        newMedicalCardNumber,
        newSex,
        newDiseaseConditions,
        newStatus,
        newDateOfBirth,
        newDateOfDeath,
        newIsProband,
        newIsGeneticOrMedicalExamination,
        newAnnotation
    ], [
        oldName,
        oldMedicalCardNumber,
        oldSex,
        oldDiseaseConditions,
        oldStatus,
        oldDateOfBirth,
        oldDateOfDeath,
        oldIsProband,
        oldIsGeneticOrMedicalExamination,
        oldAnnotation
    ]) => {
    if (
        newName !== dialogClickNode?.value.data.name ||
        newMedicalCardNumber !== dialogClickNode?.value.data.medicalCardNumber ||
        newSex !== dialogClickNode?.value.data.sex ||
        newDiseaseConditions !== dialogClickNode?.value.data.diseaseConditions ||
        newStatus !== dialogClickNode?.value.data.status ||
        newDateOfBirth !== dialogClickNode?.value.data.dateOfBirth ||
        newDateOfDeath !== dialogClickNode?.value.data.dateOfDeath ||
        newIsProband !== dialogClickNode?.value.data.isProband ||
        newIsGeneticOrMedicalExamination !== dialogClickNode?.value.data.isGeneticOrMedicalExamination ||
        newAnnotation !== dialogClickNode?.value.data.annotation
  ) {
    haveEdited.value = true
  }
  else {
    haveEdited.value = false
  }
})
</script>

<style scoped>
.dialog-content {
    display: flex;
    flex-direction: column;
}

.row-content {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 28px;
}

.dialog-footer {
    height: fit-content;
}
</style>