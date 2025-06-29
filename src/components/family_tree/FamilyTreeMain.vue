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

    <el-dialog 
        v-model="isScreenshotClicked" 
        title="图片预览"
        width="800" 
        top="10vh"
        :close-on-click-modal="false" 
        :append-to-body="true"
    >
        <img class="screenshot-preview" :src="dataUrl" />
        <template #footer>
            <el-button type="primary" @click="downloadScreenshotHandler">下载</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, watch, markRaw, onMounted } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { Background } from '@vue-flow/background'
import { storeToRefs } from 'pinia'

import NodeContextMenu from '@/components/family_tree/nodes/menu/NodeContextMenu.vue'

import { FamilyTreeNodeTypeEnum } from '@/enums/family_tree/FamilyTreeNodeTypeEnum'
import FamilyTreeNode from '@/components/family_tree/nodes/FamilyTreeNode.vue'
import NodeInformationDrawer from '@/components/family_tree/NodeInformationDrawer.vue'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import { edges } from '@/hooks/family_tree/useEdge.js'
import { drawerClickNode, onNodeClickHandler, nodeInformationDrawerVisible } from '@/hooks/family_tree/useDrawer.js'
import { nodeMenuVisible, onNodeContextMenu } from '@/hooks/family_tree/useMenu.js'
import { isScreenshotClicked, useScreenshot } from '@/hooks/family_tree/useScreenshot'

const nodeTypes = {
    [FamilyTreeNodeTypeEnum.FAMILY_TREE_NODE]: markRaw(FamilyTreeNode),
}
const { vueFlowRef } = useVueFlow()
const { dataUrl, download, doScreenshot } = useScreenshot()
const nodeStore = useNodeStore()
const { nodes } = storeToRefs(nodeStore)

// 控制是否正在截图，截图时隐藏部分组件
const isCapturing = ref(false)

// 监听截图标志，触发截图流程
watch(isScreenshotClicked, async (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        // 没有可导出的家系图时提示
        if (!vueFlowRef.value) {
            ElMessage({
                type: 'warning',
                message: '无可导出的家系图',
            })
            return;
        }
        isCapturing.value = true

        // 执行截图，结束后恢复显示
        await doScreenshot(vueFlowRef.value).finally(() => {
            isCapturing.value = false
        });
    }
});

// 下载截图图片
function downloadScreenshotHandler() {
    download()
}

// 节点点击事件，打开节点信息Drawer
function nodeClickHandler(e) {
    nodeMenuVisible.value = false
    drawerClickNode.value = nodeStore.findNodeById(e.node.id)
    onNodeClickHandler()
}

// 节点右键菜单事件，显示自定义菜单
function nodeContextMenuHandler(e) {
    onNodeContextMenu(e)
}

// 节点拖拽开始时隐藏菜单
function nodeDragStartHandler(e) {
    nodeMenuVisible.value = false
}

// 画布右键菜单事件，隐藏节点菜单
function contextMenuHandler(e) {
    nodeMenuVisible.value = false
}

// 画布点击事件，隐藏节点菜单
function clickHandler(e) {
    nodeMenuVisible.value = false
}

// 画布移动开始事件，隐藏节点菜单
function moveStartHandler(e) {
    nodeMenuVisible.value = false
}

// 视口变化开始事件，隐藏节点菜单
function viewportChangeStartHandler(e) {
    nodeMenuVisible.value = false
}

// 组件挂载时，若无节点则自动添加一个初始节点
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

.screenshot-preview{
    width: 100%; 
    height: auto; 
    border: 1px solid #c8c9cc;
}
</style>