import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { NodeType } from '../enums/NodeType'
import {
  dragAdsorption,
  updateParentNode,
  updateNodePosAddWhenNode,
  dragPasteAdsorption,
} from './useAdsorption'
import * as NodeInitAttribute from '../components/flow/nodes/attribute/NodeInitAttribute'
import { findNodeById, getNodeId } from './useNode'
import { generateUniqueFlowName } from './useNodeOfFlow'

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
    default:
      return null
  }
}
/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  draggedId: ref(null),
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
  newNodeType: ref(''),
}

export default function useDragAndDrop() {
  const { draggedId, draggedType, isDragOver, isDragging, newNodeType } = state
  const { screenToFlowCoordinate, addNodes } = useVueFlow()

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event, type) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true
    newNodeType.value = type

    document.addEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drag over event.
   *
   * @param {DragEvent} event
   */
  function onDragOver(event) {
    event.preventDefault()

    if (draggedType.value) {
      isDragOver.value = true

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move'
      }
    }
  }

  function onDragLeave() {
    isDragOver.value = false
  }

  function onDragEnd() {
    isDragging.value = false
    isDragOver.value = false
    draggedType.value = null
    document.removeEventListener('drop', onDragEnd)
  }

  /**
   * Handles the drop event.
   *
   * @param {DragEvent} event
   */
  function onDrop(event) {
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })
    const nodeId = getNodeId()
    var newNode = JSON.parse(JSON.stringify(getNewNode(newNodeType.value)))
    newNode = {
      id: nodeId,
      type: newNodeType.value,
      data: newNode.data,
      position: position,
      dimensions: newNode.dimensions,
      initDimensions: newNode.initDimensions,
      style: {
        width: `${newNode.dimensions.width}px`,
        height: `${newNode.dimensions.height}px`,
      },
      adsorption: newNode.adsorption,
    }
    if (newNode.adsorption) {
      newNode.childNodes = []
    }
    let pos = {
      layerX: newNode.position.x,
      layerY: newNode.position.y,
    }
    dragAdsorption(newNode, pos)
    if (newNode.type == NodeType.SUBFLOW) {
      newNode.data.displayName = generateUniqueFlowName()
    }
    if (newNode.type == NodeType.CHOICE) {
      newNode.childNodes = []
      newNode.defaultNode = initChoice(newNode)
    }

    initFlow(newNode)
    addNodes(newNode)
  }

  function initFlow(newNode) {
    if (newNode.parentNode != undefined || newNode.type == NodeType.SUBFLOW) {
      return
    }
    const nodeId = getNodeId()
    var flowNode = JSON.parse(JSON.stringify(getNewNode(NodeType.FLOW)))
    flowNode = {
      id: nodeId,
      type: NodeType.FLOW,
      data: flowNode.data,
      position: {
        x: newNode.position.x,
        y: newNode.position.y,
      },
      dimensions: flowNode.dimensions,
      initDimensions: flowNode.initDimensions,
      style: {
        width: `${flowNode.dimensions.width}px`,
        height: `${flowNode.dimensions.height}px`,
      },
      adsorption: flowNode.adsorption,
    }
    flowNode.data.displayName = generateUniqueFlowName()
    if (flowNode.adsorption) {
      flowNode.childNodes = []
    }
    let pos = {
      layerX: flowNode.position.x,
      layerY: flowNode.position.y,
    }
    newNode.parentNode = nodeId
    dragAdsorption(flowNode, pos)
    addNodes(flowNode)

    dragPasteAdsorption(newNode, flowNode)
  }

  function initChoice(node) {
    var defaultNode = getNewNode(NodeType.CHOICEDEFAULT)
    const defaultNodeId = getNodeId()
    defaultNode = {
      id: defaultNodeId,
      type: NodeType.CHOICEDEFAULT,
      position: {
        x: 50,
        y: 20,
      },
      dimensions: defaultNode.dimensions,
      initDimensions: defaultNode.initDimensions,
      style: {
        width: `${defaultNode.dimensions.width}px`,
        height: `${defaultNode.dimensions.height}px`,
      },
      parentNode: node.id,
      draggable: false,
      adsorption: defaultNode.adsorption,
    }
    defaultNode.childNodes = []
    updateParentNode(defaultNode, node)
    addNodes(defaultNode)
    node.childNodes.push(defaultNodeId)
    return defaultNodeId
  }

  function addWhenNode(parentNodeId) {
    let parentNode = findNodeById(parentNodeId)
    var whenNode = getNewNode(NodeType.CHOICEWHEN)
    const whenNodeId = getNodeId()
    whenNode = {
      id: whenNodeId,
      type: NodeType.CHOICEWHEN,
      data: whenNode.data,
      position: {
        x: 50,
        y: parseInt(parentNode.style.height) - 20,
      },
      dimensions: whenNode.dimensions,
      initDimensions: whenNode.initDimensions,
      style: {
        width: `${whenNode.dimensions.width}px`,
        height: `${whenNode.dimensions.height}px`,
      },
      parentNode: parentNode.id,
      draggable: false,
      adsorption: whenNode.adsorption,
      childNodes: whenNode.childNodes,
    }
    whenNode.childNodes = []
    addNodes(whenNode)
    updateNodePosAddWhenNode(whenNode, parentNode)
    parentNode.childNodes.push(whenNodeId)
  }

  function onNodeDragStart(e) {
    const dragNode = e.event == undefined ? e : e.nodes[0]
    isDragging.value = true
    draggedId.value = dragNode.id
  }

  function onNodeDragStop(e) {
    const dragNode = e.event == undefined ? e : e.nodes[0]
    isDragging.value = false
    draggedId.value = null
    if (dragNode) {
      let pos = {
        layerX: dragNode.position.x,
        layerY: dragNode.position.y,
      }
      dragAdsorption(dragNode, pos)
    }
  }

  return {
    draggedId,
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
    onNodeDragStart,
    onNodeDragStop,
    addWhenNode,
  }
}
