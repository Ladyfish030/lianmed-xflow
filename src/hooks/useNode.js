import { ref } from 'vue'

const nodes = ref([])

function findNodeById(nodeId) {
    const node = nodes.value.find(node => node.id === nodeId)
    return node
}

function addNode(newNode) {
    nodes.value.push(newNode)
}

function findAncestorsNodeById(nodeId) {
    var currentNode = findNodeById(nodeId)
    while (currentNode.parentNode) {
        currentNode = findNodeById(currentNode.parentNode)
    }
    return currentNode
}

export {
    nodes,
    findNodeById,
    addNode,
    findAncestorsNodeById,
}