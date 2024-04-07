<template>
    <div class="component-container"
        :style="{ width: `${node.dimensions.width}px`, height: `${node.dimensions.height}px` }">
        <el-text class="span-text" truncated>
            {{ expression }}
        </el-text>
        <el-divider class="divider" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref, watch } from 'vue'
import { saveComplete, findClickedNode } from '@/hooks/useDrawer'

const props = defineProps({
    node: Object
})

const expression = ref(props?.node.data.expression || 'When')

watch(saveComplete, (newValue, oldValue) => {
    if (oldValue === false && newValue === true) {
        const clickedNode = findClickedNode()
        if (clickedNode.id == props.node.id) {
            expression.value = clickedNode.data.expression
        }
    }
})
</script>

<style scoped>
.component-container {
    border: 1px solid #b1b3b8;
    border-radius: 3px;
    background-color: white;
    position: relative;
}

.span-text {
    position: absolute;
    top: 10px;
    transform: translate(-50%, -50%);
    font-size: 11px;
    color: black;
    line-height: 150%;
    width: 90%;
}

.divider {
    margin-top: 20px;
}
</style>
