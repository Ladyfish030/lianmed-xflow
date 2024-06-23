<template>
  <el-drawer v-model="drawer" direction="rtl" :before-close="handleClose" :append-to-body="true"
    :destroy-on-close="true">
    <template #header>
      <span class="drawer-header-span">组件属性</span>
    </template>
    <component v-if="currentDrawer" :is="currentDrawer" />
    <span v-else class="none-span">无</span>
    <template #footer>
      <transition name="fade">
        <el-button v-if="saveComplete" type="success">
          <el-icon><Select /></el-icon>
        </el-button>
      </transition>
      <el-button type="primary" @click="saveAttributeWithAnimation">保存</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import DatabaseDrawer from '../flow/nodes/drawer/DatabaseDrawer.vue'
import WebServiceDrawer from '../flow/nodes/drawer/WebServiceDrawer.vue'
import ListenerDrawer from '../flow/nodes/drawer/ListenerDrawer.vue'
import ChoiceWhenDrawer from '../flow/nodes/drawer/ChoiceWhenDrawer.vue'
import FlowDrawer from '../flow/nodes/drawer/FlowDrawer.vue'
import FlowReferenceDrawer from '../flow/nodes/drawer/FlowReferenceDrawer.vue'
import LoggerDrawer from '../flow/nodes/drawer/LoggerDrawer.vue'
import SetPayloadDrawer from '../flow/nodes/drawer/SetPayloadDrawer.vue'
import RequestDrawer from './nodes/drawer/RequestDrawer.vue'

import { drawer, drawerClickNode, handleClose, saveAttribute, saveComplete } from '@/hooks/useDrawer'
import { NodeType } from '@/enums/NodeType'

const currentDrawer = computed(() => {
  switch (drawerClickNode.value.type) {
    case NodeType.FLOW:
      return FlowDrawer
    case NodeType.DATABASE:
      return DatabaseDrawer
    case NodeType.WEBSERVICE:
      return WebServiceDrawer
    case NodeType.LISTENER:
      return ListenerDrawer
    case NodeType.CHOICEWHEN:
      return ChoiceWhenDrawer
    case NodeType.SUBFLOW:
      return FlowDrawer
    case NodeType.FLOWREFERENCE:
      return FlowReferenceDrawer
    case NodeType.LOGGER:
      return LoggerDrawer
    case NodeType.SETPAYLOAD:
      return SetPayloadDrawer
    case NodeType.REQUEST:
      return RequestDrawer
    default:
      return null
  }
})

function saveAttributeWithAnimation() {
  saveAttribute()
  setTimeout(() => {
    saveComplete.value = false
  }, 1000) // 控制动画显示的时间
}

</script>

<style scoped>
.drawer-header-span {
  color: black;
  font-weight: bold;
  font-size: 20px;
}

.none-span {
  display: flex;
  justify-content: center;
  color: #b1b3b8;
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