import { ref } from 'vue'

const nodes = ref([])

function findNodeById(nodeId) {
    const node = nodes.value.find(node => node.id === nodeId)
    return node
}

function addNode(newNode) {
    nodes.value.push(newNode)
}

export {
    nodes,
    findNodeById,
    addNode,
}