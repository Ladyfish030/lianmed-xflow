<template>
    <div v-if="edgeMenuVisible" 
      class="menu-container" 
      :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
    >
    <CommonEdgeMenu />
    </div>
</template>

<script setup>
import { edgeMenuVisible, menuPosition } from '../hooks/useMenu'
import CommonEdgeMenu from '../components/edges/menu/CommonEdgeMenu.vue'
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