import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { NodeType } from '../enums/NodeType'
import {
  dragAdsorption,
  updateParentNode,
  updateNodePosAddWhenNode,
} from './useAdsorption.js'
import * as NodeAttribute from '../components/nodes/attribute/NodeAttribute'
import { findNodeById, nodes } from './useNode.js'

let id = 0
function getId() {
  return `dndnode_${id++}`
}

function getNewNode(newNodeType) {
  switch (newNodeType) {
    case NodeType.DATABASE:
      return NodeAttribute.Database
    case NodeType.WEBSERVICE:
      return NodeAttribute.WebService
    case NodeType.CHOICE:
      return NodeAttribute.Choice
    case NodeType.CHOICEWHEN:
      return NodeAttribute.ChoiceWhen
    case NodeType.CHOICEDEFAULT:
      return NodeAttribute.ChoiceDefault
    case NodeType.FOREACH:
      return NodeAttribute.ForEach
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
    console.log('onDrop', event)
    const position = screenToFlowCoordinate({
      x: event.clientX,
      y: event.clientY,
    })

    const nodeId = getId()
    var newNode = getNewNode(newNodeType.value)
    newNode = {
      id: nodeId,
      type: newNodeType.value,
      data: newNode.data,
      position: {
        x: position.x - newNode.dimensions.width / 2,
        y: position.y - newNode.dimensions.height / 2,
      },
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
      layerX: event.layerX,
      layerY: event.layerY,
    }
    dragAdsorption(newNode, pos)

    if (newNode.adsorption) {
      updateParentNode(newNode)
    }
    if (newNode.type == NodeType.CHOICE) {
      newNode.childNodes = []
      newNode.defaultNode = initChoice(newNode)
    }
    addNodes(newNode)
  }

  function initChoice(node) {
    var defaultNode = getNewNode(NodeType.CHOICEDEFAULT)
    const defaultNodeId = getId()
    defaultNode = {
      id: defaultNodeId,
      type: NodeType.CHOICEDEFAULT,
      position: {
        x: 50,
        y: 15,
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
    node.defaultNode = defaultNodeId
    updateParentNode(defaultNode, node)
    addNodes(defaultNode)
    node.childNodes.push(defaultNodeId)
    return defaultNodeId
  }
  function addWhenNode(parentNodeId) {
    let parentNode = findNodeById(parentNodeId)
    var whenNode = getNewNode(NodeType.CHOICEWHEN)
    const whenNodeId = getId()
    whenNode = {
      id: whenNodeId,
      type: NodeType.CHOICEWHEN,
      data: whenNode.data,
      position: {
        x: 50,
        y: parseInt(parentNode.style.height) - 30,
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
    }
    whenNode.childNodes = []
    console.log(parentNode.style.height)
    parentNode.style.height =
      parseInt(parentNode.style.height) + whenNode.dimensions.height + 20 + 'px'
    addNodes(whenNode)
    parentNode.childNodes.push(whenNodeId)
    updateNodePosAddWhenNode(whenNode, parentNode)
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
        layerX: e.event.layerX,
        layerY: e.event.layerY,
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
