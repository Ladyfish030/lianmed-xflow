import { useVueFlow } from '@vue-flow/core'
import { reactive, ref, watch } from 'vue'
let id = 0

/**
 * @returns {string} - A unique id.
 */
function getId() {
  return id++
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
  nodeType: ref(''), //记忆当前节点类型
  nodeLabel: ref(''),
}

export default function useDragAndDrop() {
  const nodeList = reactive([])
  let typeList = {
    database: ['组件名', '数据库连接类型', '数据库连接方式', '搜索语句'],
  }
  const { draggedType, isDragOver, isDragging, nodeType } = state

  const { addNodes, screenToFlowCoordinate, onNodesInitialized, updateNode } =
    useVueFlow()

  watch(isDragging, (dragging) => {
    document.body.style.userSelect = dragging ? 'none' : ''
  })

  function onDragStart(event, type, newNodeType) {
    nodeType.value = newNodeType
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/vueflow', type)
      event.dataTransfer.effectAllowed = 'move'
    }

    draggedType.value = type
    isDragging.value = true

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
    const newNode = reactive({
      id: nodeId,
      type: draggedType.value,
      position,
      label: `[${nodeId}]`,
      property: {},
      nodeType: nodeType.value,
    })
    if (nodeType.value == 'childFlow' || nodeType.value == 'foreach') {
      newNode.style = {
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        width: '200px',
        height: '200px',
      }
    }
    for (let i in typeList[nodeType.value]) {
      let key = typeList[nodeType.value][i]
      newNode.property[key] = ''
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

    addNodes(newNode)
    nodeList.push(newNode)
  }

  return {
    draggedType,
    isDragOver,
    isDragging,
    onDragStart,
    onDragLeave,
    onDragOver,
    onDrop,
    nodeList,
  }
}
