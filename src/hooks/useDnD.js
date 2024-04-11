import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { NodeType } from '../enums/NodeType'
import {
  dragAdsorption,
  removeParentNode,
  updateParentNode,
} from './useAdsorption.js'
import * as NodeAttribute from '../components/nodes/attribute/NodeAttribute'

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
      style: {
        width: `${newNode.dimensions.width}px`,
        height: `${newNode.dimensions.height}px`,
      },
    }
    if (newNode.type == NodeType.FOREACH) {
      newNode.adsorption = true
      newNode.childNodes = []
    }
    dragAdsorption(newNode)
    updateParentNode(newNode)
    addNodes(newNode)
    if (newNode.type == NodeType.CHOICE) {
      initChoice(newNode)
    }
  }

  function initChoice(node) {
    var whenNode = getNewNode(NodeType.CHOICEWHEN)
    const whenNodeId = getId()
    whenNode = {
      id: whenNodeId,
      type: NodeType.CHOICEWHEN,
      data: whenNode.data,
      position: {
        x: node.dimensions.width - whenNode.dimensions.width - 10,
        y: 10,
      },
      dimensions: whenNode.dimensions,
      style: {
        width: `${whenNode.dimensions.width}px`,
        height: `${whenNode.dimensions.height}px`,
      },
      parentNode: node.id,
      expandParent: true,
      draggable: false,
    }
    addNodes(whenNode)

    var defaultNode = getNewNode(NodeType.CHOICEDEFAULT)
    const defaultNodeId = getId()
    defaultNode = {
      id: defaultNodeId,
      type: NodeType.CHOICEDEFAULT,
      position: {
        x: node.dimensions.width - defaultNode.dimensions.width - 10,
        y: node.dimensions.height - defaultNode.dimensions.height - 10,
      },
      dimensions: defaultNode.dimensions,
      style: {
        width: `${defaultNode.dimensions.width}px`,
        height: `${defaultNode.dimensions.height}px`,
      },
      parentNode: node.id,
      expandParent: true,
      draggable: false,
    }
    addNodes(defaultNode)
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
      dragAdsorption(dragNode)
      updateParentNode(dragNode)
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
  }
}
