<template>
  <div v-if="nodeMenuVisible" class="menu-container"
    :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }">
    <component :is="currentMenu" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { nodeMenuVisible, menuClickNode, menuPosition } from '../hooks/useMenu'
import { NodeType } from '../enums/NodeType'
import DatabaseMenu from '../components/nodes/menu/DatabaseMenu.vue'
import WebServiceMenu from '../components/nodes/menu/WebServiceMenu.vue'
import ChoiceMenu from '../components/nodes/menu/ChoiceMenu.vue'
import ChoiceWhenMenu from '../components/nodes/menu/ChoiceWhenMenu.vue'
import ChoiceDefaultMenu from '../components/nodes/menu/ChoiceDefaultMenu.vue'
import ForEachMenu from '../components/nodes/menu/ForEachMenu.vue'
import SubFlowMenu from '../components/nodes/menu/SubFlowMenu.vue'
import LoggerMenu from '../components/nodes/menu/LoggerMenu.vue'
import FlowReferenceMenu from '../components/nodes/menu/FlowReferenceMenu.vue'

const currentMenu = computed(() => {
  switch (menuClickNode.value.type) {
    case NodeType.DATABASE:
      return DatabaseMenu
    case NodeType.WEBSERVICE:
      return WebServiceMenu
    case NodeType.CHOICE:
      return ChoiceMenu
    case NodeType.CHOICEWHEN:
      return ChoiceWhenMenu
    case NodeType.CHOICEDEFAULT:
      return ChoiceDefaultMenu
    case NodeType.FOREACH:
      return ForEachMenu
    case NodeType.SUBFLOW:
      return SubFlowMenu
    case NodeType.LOGGER:
      return LoggerMenu
    case NodeType.FLOWREFERENCE:
      return FlowReferenceMenu
    default:
      return null
  }
})
</script>

<style scoped>
.menu-container {
  position: absolute;
  width: 150px;
  border: 1px solid #e9e9eb;
  border-radius: 5px;
  background-color: white;
  -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: 1000;
}
</style>