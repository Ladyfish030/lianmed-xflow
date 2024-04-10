import { ref } from 'vue'

const nodes = ref([])

function findNodeById(nodeId) {
    const node = nodes.value.find(node => node.id === nodeId)
    return node
}

export { findNodeById, nodes }