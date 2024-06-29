import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { NodeType } from '../enums/NodeType'
import * as NodeInitAttribute from '../components/flow/nodes/attribute/NodeInitAttribute'

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

function getNewNode(newNodeType) {
    switch (newNodeType) {
      case NodeType.FLOW:
        return NodeInitAttribute.Flow
      case NodeType.DATABASE:
        return NodeInitAttribute.Database
      case NodeType.WEBSERVICE:
        return NodeInitAttribute.WebService
      case NodeType.LISTENER:
        return NodeInitAttribute.Listener
      case NodeType.CHOICE:
        return NodeInitAttribute.Choice
      case NodeType.CHOICEWHEN:
        return NodeInitAttribute.ChoiceWhen
      case NodeType.CHOICEDEFAULT:
        return NodeInitAttribute.ChoiceDefault
      case NodeType.FOREACH:
        return NodeInitAttribute.ForEach
      case NodeType.SUBFLOW:
        return NodeInitAttribute.SubFlow
      case NodeType.LOGGER:
        return NodeInitAttribute.Logger
      case NodeType.FLOWREFERENCE:
        return NodeInitAttribute.FlowReference
      case NodeType.SETPAYLOAD:
        return NodeInitAttribute.SetPayload
      case NodeType.REQUEST:
        return NodeInitAttribute.Request
      default:
        return null
    }
  }

export {
    nodes,
    getNodeId,
    findNodeById,
    addNode,
    findAncestorsNodeById,
    findAbsolutePositionByNodeId,
    getNewNode,
}