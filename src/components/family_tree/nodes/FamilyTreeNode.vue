<template>
  <div class="component-container" :style="{ backgroundColor: nodeId === drawerClickNode.id ? '#c6e2ff' : (nodeStore.deleteNodes.includes(nodeId) ? '#f89898' : '')}">
    <Handle id="target-top" type="target" :position="Position.Top" class="handle" style="margin-top: -15px;"/>
    <Handle id="source-bottom" type="source" :position="Position.Bottom" class="handle"/>
    <Handle id="target-left" type="target" :position="Position.Left" class="handle"/>
    <Handle id="source-left" type="source" :position="Position.Left" class="handle"/>
    <Handle id="source-right" type="source" :position="Position.Right" class="handle"/>
    <div class="content">
      <el-tooltip 
        v-if="name !== ''"
        effect="dark" 
        placement="top" 
        :hide-after="0"
      >
        <template #content>{{name}}</template>
        <el-text class="name-text" size="small" truncated>{{name}}</el-text>
      </el-tooltip>
      
      <el-text class="serial-number-text" size="small" truncated>{{`${arabicToRoman(generation)}-${horizontalPosition}`}}</el-text>
      <el-text v-if="status === 0 && dateOfBirth !== ''" class="date-text" size="small" truncated>{{`b. ${dateOfBirth.split('-')[0]}`}}</el-text>
      <el-text v-if="status === 1 && dateOfDeath !== ''" class="date-text" size="small" truncated>{{`d. ${dateOfDeath.split('-')[0]}`}}</el-text>
      
      <el-tooltip 
        v-if="annotation !== ''"
        effect="dark" 
        placement="bottom" 
        :hide-after="0"
      >
        <template #content>{{annotation}}</template>
        <el-text class="annotation-text" size="small" truncated>{{annotation}}</el-text>
      </el-tooltip>

      <ProbandIcon v-if="isProband" class="proband-icon" />
      <ExaminationIcon v-if="isGeneticOrMedicalExamination" class="examination-icon" />
      <MaleIcon v-if="sex === 1 && diseaseConditions !== 1" class="male-icon" />
      <MaleDiseaseIcon v-if="sex === 1 && diseaseConditions === 1" class="male-disease-icon" />
      <FemaleIcon v-if="sex === 0 && diseaseConditions !== 1" class="female-icon" />
      <FemaleDiseaseIcon v-if="sex === 0 && diseaseConditions === 1" class="female-disease-icon" />
      <UnknownSexIcon v-if="sex === 2 && diseaseConditions !== 1" class="unknown-sex-icon" />
      <UnknownSexDiseaseIcon v-if="sex === 2 && diseaseConditions === 1" class="unknown-sex-disease-icon" />
      <DeathIcon v-if="status === 1" class="death-icon" />
      <CarrierIcon v-if="diseaseConditions === 2" class="carrier-icon" />
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'
import { ref, watch, computed, getCurrentInstance } from 'vue'

import MaleIcon from '@/assets/svg/family_tree/MaleIcon.vue'
import MaleDiseaseIcon from '@/assets/svg/family_tree/MaleDiseaseIcon.vue'
import FemaleIcon from '@/assets/svg/family_tree/FemaleIcon.vue'
import FemaleDiseaseIcon from '@/assets/svg/family_tree/FemaleDiseaseIcon.vue'
import UnknownSexIcon from '@/assets/svg/family_tree/UnknownSexIcon.vue'
import UnknownSexDiseaseIcon from '@/assets/svg/family_tree/UnknownSexDiseaseIcon.vue'
import ProbandIcon from '@/assets/svg/family_tree/ProbandIcon.vue'
import DeathIcon from '@/assets/svg/family_tree/DeathIcon.vue'
import CarrierIcon from '@/assets/svg/family_tree/CarrierIcon.vue'
import ExaminationIcon from '@/assets/svg/family_tree/ExaminationIcon.vue'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import { drawerClickNode } from '@/hooks/family_tree/useDrawer'

import arabicToRoman from '@/utils/arabicToRoman.js'

const instance = getCurrentInstance()
const nodeId = instance.attrs.id

const nodeStore = useNodeStore()
const node = nodeStore.findNodeById(nodeId)

const name = computed(() => node?.data.name)
const generation = computed(() => node?.data.generation)
const horizontalPosition = computed(() => node?.data.horizontalPosition)
const sex = computed(() => node?.data.sex)
const diseaseConditions = computed(() => node?.data.diseaseConditions)
const status = computed(() => node?.data.status)
const dateOfBirth = computed(() => node?.data.dateOfBirth)
const dateOfDeath = computed(() => node?.data.dateOfDeath)
const isProband = computed(() => node?.data.isProband)
const isGeneticOrMedicalExamination = computed(() => node?.data.isGeneticOrMedicalExamination)
const annotation = computed(() => node?.data.annotation)
</script>

<style scoped>
.component-container {
  display: flex;
  justify-content: center;
  border: 0px;
  border-radius: 5px;
  background-color: transparent;
  height: 100%;
  width: 100%;
}

.handle {
  opacity: 0;
}

.component-container:hover {
  background-color: #c6e2ff;
  cursor: pointer;
}

.content {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 15px 50px 15px 20px;
  grid-template-areas: 
    "name serial-number ."
    ". icons ."
    "proband date examination"
    "annotation annotation annotation";
  justify-items: center;
  align-items: center;
  width: 150px;
  height: 100px;
  margin-bottom: auto;
  margin-top: -15px;
  pointer-events: none;
}

.name-text {
  grid-area: name;
  line-height: 1.5;
  width: 100%;
  margin-right: 0px;
  margin-left: auto;
  min-width: 4em;
  pointer-events: all;
}

.serial-number-text {
  grid-area: serial-number;
  line-height: 1.5;
}

.male-icon, .male-disease-icon, .female-icon, .female-disease-icon, .unknown-sex-icon, .unknown-sex-disease-icon, .carrier-icon, .death-icon {
  grid-area: icons;
  justify-self: center;
  align-self: center;
}

.proband-icon {
  grid-area: proband;
  margin-top: 0px;
  margin-bottom: auto;
  margin-right: 0px;
  margin-left: auto;
}

.date-text {
  grid-area: date;
  line-height: 1.5;
  margin-top: 0px;
  margin-bottom: auto;
}

.examination-icon {
  grid-area: examination;
  margin-right: auto;
  margin-left: 0px;
}

.annotation-text {
  grid-area: annotation;
  line-height: 1.5;
  pointer-events: all;
  max-width: 10em;
}

.span-text {
  margin-top: 10px;
  font-size: 11px;
  line-height: 100%;
}
</style>