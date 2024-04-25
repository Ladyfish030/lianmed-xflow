import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const nodes = ref([])

function getNodeId() {
    const nodeId = uuidv4();
    return nodeId
}

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
    getNodeId,
    findNodeById,
    addNode,
    findAncestorsNodeById,
    findAbsolutePositionByNodeId,
}