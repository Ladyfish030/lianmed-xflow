<template>
    <div v-if="nodeMenuVisible" 
      class="menu-container" 
      :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
    >
      <component :is="currentDrawer" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { nodeMenuVisible, menuClickNode, menuPosition } from '../hooks/useMenu'
import { NodeType } from '../enums/NodeType'
import DatabaseMenu from '../components/nodes/menu/DatabaseMenu.vue'
import WebServiceMenu from '../components/nodes/menu/WebServiceMenu.vue'

const currentDrawer = computed(() => {
    switch (menuClickNode.value.type) {
    case NodeType.DATABASE:
      return DatabaseMenu
      case NodeType.WEBSERVICE:
      return WebServiceMenu
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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); 
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
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