<template>
    <el-drawer 
        v-model="nodeInformationDrawerVisible" 
        direction="rtl" 
        :before-close="handleDrawerClose"
        :append-to-body="true" 
        :destroy-on-close="true"
    >
        <template #header>
            <span class="drawer-header-span">具体信息</span>
        </template>

        <el-scrollbar>
            <div class="form-container">
                <div class="form-item">
                    <label>姓名：</label>
                    <el-input v-model="name" size="small" placeholder="请输入" clearable class="input-field" />
                </div>

                <div class="form-item">
                    <label>就诊卡号：</label>
                    <el-input v-model="medicalCardNumber" size="small" placeholder="请输入" clearable
                        class="input-field" />
                </div>

                <div class="form-item">
                    <label>性别：</label>
                    <el-radio-group v-model="sex">
                        <el-radio v-if="femaleDisabled" style="margin-right: 26px;" :value=0 size="small">女</el-radio>
                        <el-radio v-if="maleDisabled" style="margin-right: 26px;" :value=1 size="small">男</el-radio>
                        <el-radio :value=2 size="small">未知</el-radio>
                    </el-radio-group>
                </div>

                <div class="form-item">
                    <label>疾病情况：</label>
                    <el-radio-group style="margin-right: 0px; margin-left: 0px;" v-model="diseaseConditions">
                        <el-radio style="margin-right: 8px;" :value=0 size="small">正常</el-radio>
                        <el-radio style="margin-right: 8px;" :value=1 size="small">患病</el-radio>
                        <el-radio :value=2 size="small">携带者</el-radio>
                    </el-radio-group>
                </div>

                <div class="form-item">
                    <label>状态：</label>
                    <el-radio-group v-model="status">
                        <el-radio style="margin-right: 26px;" :value=0 size="small">存活</el-radio>
                        <el-radio style="margin-right: 26px;" :value=1 size="small">死亡</el-radio>
                    </el-radio-group>
                </div>

                <div class="form-item" style="flex-direction: row;">
                    <el-checkbox v-model="isProband" label="先证者" size="small"  style="margin-right: 30px;"/>
                    <el-checkbox v-model="isGeneticOrMedicalExamination" label="遗传学检查/临床检查" size="small" />
                </div>

                <div class="form-item">
                    <label style="margin-bottom: 5px;">出生日期：</label>
                    <el-date-picker v-model="dateOfBirth" type="date" placeholder="请选择日期" size="small"
                        format="YYYY/MM/DD" value-format="YYYY-MM-DD" style="width: 100%;" />
                </div>

                <div class="form-item">
                    <label style="margin-bottom: 5px;">死亡日期：</label>
                    <el-date-picker v-model="dateOfDeath" type="date" placeholder="请选择日期" size="small"
                        format="YYYY/MM/DD" value-format="YYYY-MM-DD" style="width: 100%;" />
                </div>

                <div class="form-item">
                    <label>注释：</label>
                    <el-input 
                        v-model="annotation" 
                        size="small" 
                        placeholder="请输入内容" 
                        clearable 
                        type="textarea"
                        :autosize="{ minRows: 2}"
                        resize="none" 
                        class="input-field" />
                </div>
            </div>

        </el-scrollbar>


        <template #footer>
            <div class="drawer-footer">
                <transition name="fade">
                    <el-button v-if="saveComplete" type="success">
                        <el-icon><Select /></el-icon>
                    </el-button>
                </transition>
                <el-button type="primary" @click="saveAttributeWithAnimation"
                    :disabled="isSave === true && saveComplete === false">保存</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import {
    drawerClickNode,
    nodeInformationDrawerVisible,
    haveEdited,
    saveComplete,
} from '@/hooks/family_tree/useDrawer'

const { updateNode } = useVueFlow()
const nodeStore = useNodeStore()

const name = ref(drawerClickNode?.value.data.name || '')
const medicalCardNumber = ref(drawerClickNode?.value.data.medicalCardNumber || '')
const sex = ref(drawerClickNode?.value.data.sex || 0)
const diseaseConditions = ref(drawerClickNode?.value.data.diseaseConditions || 0)
const status = ref(drawerClickNode?.value.data.status || 0)
const dateOfBirth = ref(drawerClickNode?.value.data.dateOfBirth || '')
const dateOfDeath = ref(drawerClickNode?.value.data.dateOfDeath || '')
const isProband = ref(drawerClickNode?.value.data.isProband || false)
const isGeneticOrMedicalExamination = ref(drawerClickNode?.value.data.isGeneticOrMedicalExamination || false)
const annotation = ref(drawerClickNode?.value.data.annotation || '')

const isSave = ref(false)
const femaleDisabled = computed(() => {
    if (drawerClickNode.value.mateId !== '') {
        const mate = nodeStore.findNodeById(drawerClickNode.value.mateId)
        if (mate.data.horizontalPosition > drawerClickNode.value.data.horizontalPosition) {
            return false
        }
    }
    return true
})
const maleDisabled = computed(() => {
    if (drawerClickNode.value.mateId !== '') {
        const mate = nodeStore.findNodeById(drawerClickNode.value.mateId)
        if (mate.data.horizontalPosition < drawerClickNode.value.data.horizontalPosition) {
            return false
        }
    }
    return true
})

function saveAttributeWithAnimation() {
    isSave.value = true
    saveComplete.value = false
    updateNode(drawerClickNode.value.id,
        {
            data:
            {
                ...drawerClickNode.value.data,
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
            if (node.id !== drawerClickNode.value.id) {
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

const handleDrawerClose = (done) => {
    if (haveEdited.value === true) {
        ElMessageBox.confirm(
            '确定关闭？请注意保存',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }
        )
            .then(() => {
                nodeInformationDrawerVisible.value = false
                drawerClickNode.value = {}
                haveEdited.value = false
                saveComplete.value = false
                done()
            })
            .catch(() => {
                // catch error
            })
    }
    else {
        nodeInformationDrawerVisible.value = false
        drawerClickNode.value = {}
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
        newName !== drawerClickNode?.value.data.name ||
        newMedicalCardNumber !== drawerClickNode?.value.data.medicalCardNumber ||
        newSex !== drawerClickNode?.value.data.sex ||
        newDiseaseConditions !== drawerClickNode?.value.data.diseaseConditions ||
        newStatus !== drawerClickNode?.value.data.status ||
        newDateOfBirth !== drawerClickNode?.value.data.dateOfBirth ||
        newDateOfDeath !== drawerClickNode?.value.data.dateOfDeath ||
        newIsProband !== drawerClickNode?.value.data.isProband ||
        newIsGeneticOrMedicalExamination !== drawerClickNode?.value.data.isGeneticOrMedicalExamination ||
        newAnnotation !== drawerClickNode?.value.data.annotation
  ) {
    haveEdited.value = true
  }
  else {
    haveEdited.value = false
  }
})
</script>

<style scoped>
.form-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    gap: 10px;
    width: 95%;
    margin-left: 5px;
}

.drawer-header-span {
    color: black;
    font-weight: bold;
    font-size: 20px;
}

.form-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  margin-bottom: 10px;
}

.form-item label {
  font-size: 15px;
}

.input-field {
  margin-top: 5px;
  margin-bottom: 5px;
}

.drawer-footer {
    height: fit-content;
}

.fade-enter-active,
.fade-leave-active {
    -webkit-transition: opacity 1s;
    -o-transition: opacity 1s;
    transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>