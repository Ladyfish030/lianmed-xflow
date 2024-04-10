import { ref } from 'vue'

const clickedNode = ref(null)

function onNodeContextMenu(e) {
    // console.log("点击：", e)
    clickedNode.value = e.node
}

export { clickedNode, onNodeContextMenu }