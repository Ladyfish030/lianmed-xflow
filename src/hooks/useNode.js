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

function findAbsolutePositionByNodeId(nodeId) {
    var currentNode = findNodeById(nodeId)
    var absolutePosition = currentNode.position
    while (currentNode.parentNode) {
        currentNode = findNodeById(currentNode.parentNode)
        absolutePosition = {
            x: absolutePosition.x + currentNode.position.x,
            y: absolutePosition.y + currentNode.position.y,
        }
    }
    return absolutePosition
}

export {
    nodes,
    findNodeById,
    addNode,
    findAncestorsNodeById,
    findAbsolutePositionByNodeId,
}