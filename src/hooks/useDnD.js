import { useVueFlow } from '@vue-flow/core'
import { ref, watch, reactive } from 'vue'
import { NodeType } from '../enums/NodeType'
import * as NodeAttribute from '../components/nodes/attribute/NodeAttribute'
let id = 0

/**
 * @returns {string} - A unique id.
 */
function getId() {
  return `dndnode_${id++}`
}

function getNewNode(newNodeType) {
  switch (newNodeType) {
    case NodeType.DATABASE:
      return NodeAttribute.Database
    case NodeType.WEBSERVICE:
      return NodeAttribute.WebService
    case NodeType.CONDITIONALBRANCH:
      return NodeAttribute.ConditionalBranch
    default: 
      return null
  }
}

/**
 * In a real world scenario you'd want to avoid creating refs in a global scope like this as they might not be cleaned up properly.
 * @type {{draggedType: Ref<string|null>, isDragOver: Ref<boolean>, isDragging: Ref<boolean>}}
 */
const state = {
  /**
   * The type of the node being dragged.
   */
  draggedType: ref(null),
  isDragOver: ref(false),
  isDragging: ref(false),
  newNodeType: ref(''),
  nodes: ref([]),
}

export default function useDragAndDrop() {
  const { draggedType, isDragOver, isDragging, newNodeType, nodes} = state

  const { screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow()

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
        position: position,
    }
    const { off } = onNodesInitialized(() => {
      updateNode(nodeId, (node) => ({
        position: {
          x: node.position.x - node.dimensions.width / 2,
          y: node.position.y - node.dimensions.height / 2,
        },
      }))

      off()
    })

    nodes.value.push(newNode)

  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    nodes,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
  }
}
