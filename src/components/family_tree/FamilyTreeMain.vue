<template>
    <VueFlow 
        v-model:nodes="nodes" 
        v-model:edges="edges"
        @node-click="nodeClickHandler"
        @node-context-menu="nodeContextMenuHandler"
        @node-drag-start="nodeDragStartHandler"
        @contextmenu.capture.prevent="contextMenuHandler"
        @click="clickHandler"
        @move-start="moveStartHandler"
        @viewport-change-start="viewportChangeStartHandler"
        :node-types="nodeTypes"
        :zoomOnDoubleClick="false" 
        :delete-key-code="null">
        <Background v-if="!isCapturing" :size="2" :gap="20" pattern-color="#b1b3b8" />
        <MiniMap v-if="!isCapturing" pannable />
        <Controls v-if="!isCapturing" position="top-right" />
        <NodeInformationDrawer v-if="nodeInformationDrawerVisible"/>
        <NodeContextMenu v-if="nodeMenuVisible"/>
    </VueFlow>
</template>

<script setup>
import { ref, watch, markRaw, onMounted } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import { storeToRefs } from 'pinia'

import NodeContextMenu from '@/components/family_tree/nodes/menu/NodeContextMenu.vue'

import { FamilyTreeNodeType } from '@/enums/family_tree/FamilyTreeNodeType'
import FamilyTreeNode from '@/components/family_tree/nodes/FamilyTreeNode.vue'
import NodeInformationDrawer from '@/components/family_tree/NodeInformationDrawer.vue'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import { edges } from '@/hooks/family_tree/useEdge.js'
import { drawerClickNode, onNodeClickHandler, nodeInformationDrawerVisible } from '@/hooks/family_tree/useDrawer.js'
import { nodeMenuVisible, onNodeContextMenu } from '@/hooks/family_tree/useMenu.js'
import { isScreenshotClicked, useScreenshot } from '@/hooks/family_tree/useScreenshot'

const nodeTypes = {
    [FamilyTreeNodeType.FAMILY_TREE_NODE]: markRaw(FamilyTreeNode),
}
const { vueFlowRef, setViewport } = useVueFlow()
const { doScreenshot } = useScreenshot()
const nodeStore = useNodeStore()
const { nodes } = storeToRefs(nodeStore)

const isCapturing = ref(false)

// 捕获截图时调用 fitViewToNodes
watch(isScreenshotClicked, async (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        if (!vueFlowRef.value) {
            ElMessage({
                type: 'warning',
                message: '无可导出的家系图',
            })
            return;
        }
        isCapturing.value = true

        await doScreenshot(vueFlowRef.value, { shouldDownload: true }).finally(() => {
            // 截屏结束后显示这些组件
            isCapturing.value = false
        });
    }
});

function nodeClickHandler(e) {
    // console.log('点击节点：', e.node)
    nodeMenuVisible.value = false
    drawerClickNode.value = nodeStore.findNodeById(e.node.id)
    onNodeClickHandler()
}

function nodeContextMenuHandler(e) {
    onNodeContextMenu(e)
}

function nodeDragStartHandler(e) {
    nodeMenuVisible.value = false
}

function contextMenuHandler(e) {
    nodeMenuVisible.value = false
}

function clickHandler(e) {
    nodeMenuVisible.value = false
}

function moveStartHandler(e) {
    nodeMenuVisible.value = false
}

function viewportChangeStartHandler(e) {
    nodeMenuVisible.value = false
}

onMounted(() => {
    if (nodes.value.length === 0) {
        nodeStore.addInitNode()
    }
})
</script>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.33.4/dist/theme-default.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';

.vue-flow__minimap {
    -webkit-transform: scale(75%);
    -ms-transform: scale(75%);
    transform: scale(75%);
    -webkit-transform-origin: bottom right;
    -ms-transform-origin: bottom right;
    transform-origin: bottom right;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.vue-flow-wrapper {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    height: 100%;
}
</style>