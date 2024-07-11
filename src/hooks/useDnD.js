import { nextTick, reactive, ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { NodeType } from '../enums/NodeType'
import {
  dragAdsorption,
  updateParentNode,
  updateNodePosAddWhenNode,
  dragPasteAdsorption,
} from './useAdsorption'
import { addNode, findNodeById, getNodeId, getNewNode } from './useNode'
import { generateUniqueFlowName } from './useNodeOfFlow'

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
  const { screenToFlowCoordinate, addNodes, findNode } = useVueFlow()

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

  //将json转成画布上的点
  function jsonTurnNode(nodeObj, pos, parentNode) {
    const nodeId = getNodeId()
    if (nodeObj.type === NodeType.CHOICEWHEN) {
      return addWhenNodeJson(parentNode, nodeObj)
    }
    var newNode = JSON.parse(JSON.stringify(getNewNode(nodeObj.type)))
    let newData = turnJsonData(nodeObj.data)
    newNode = reactive({
      id: nodeId,
      type: nodeObj.type,
      data: newData,
      position: pos,
      dimensions: newNode.dimensions,
      initDimensions: newNode.initDimensions,
      style: {
        width: `${newNode.dimensions.width}px`,
        height: `${newNode.dimensions.height}px`,
      },
      adsorption: newNode.adsorption,
    })
    if (nodeObj.childNodes) {
      newNode.childNodes = nodeObj.childNodes
    }
    let posLayer = {
      layerX: newNode.position.x,
      layerY: newNode.position.y,
    }
    if (!parentNode) {
      dragAdsorption(newNode, posLayer)
    }
    if (newNode.type == NodeType.SUBFLOW) {
      newNode.data.displayName = generateUniqueFlowName()
    }
    let defaultNode
    if (newNode.type == NodeType.CHOICE) {
      newNode.childNodes = []
      defaultNode = initChoiceJson(newNode)
      newNode.defaultNode = defaultNode.id
    }

    if (parentNode) {
      dragPasteAdsorption(newNode, parentNode)
    }
    addNode(newNode)
    if (newNode.type == NodeType.CHOICE) {
      return [defaultNode, newNode]
    }

    return [newNode]
  }

  function turnJsonData(data) {
    if (!data) {
      return data
    }
    if (data.headers && data.headers != []) {
      let obj = JSON.parse(data.headers)
      data.headers = Object.keys(obj).map((key) => {
        return {
          key,
          value: obj[key],
        }
      })
    }
    if (data.queryParameters && data.queryParameters != []) {
      let obj = JSON.parse(data.queryParameters)
      data.queryParameters = Object.keys(obj).map((key) => {
        return {
          key,
          value: obj[key],
        }
      })
    }
    if (data.urlParameters && data.urlParameters != []) {
      let obj = JSON.parse(data.urlParameters)
      data.urlParameters = Object.keys(obj).map((key) => {
        return {
          key,
          value: obj[key],
        }
      })
    }
    return data
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
        x: newNode.position.x - 1,
        y: newNode.position.y - 1,
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
      layerX: flowNode.position.x - 1,
      layerY: flowNode.position.y - 1,
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

  function initChoiceJson(node) {
    var defaultNode = getNewNode(NodeType.CHOICEDEFAULT)
    const defaultNodeId = getNodeId()
    defaultNode = reactive({
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
    })
    defaultNode.childNodes = []
    updateParentNode(defaultNode, node)
    addNode(defaultNode)
    node.childNodes.push(defaultNodeId)

    return defaultNode
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

  function addWhenNodeJson(parentNode, nodeJson) {
    var whenNode = getNewNode(NodeType.CHOICEWHEN)
    const whenNodeId = getNodeId()
    whenNode = reactive({
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
      childNodes: nodeJson.childNodes,
      data: nodeJson.data,
    })

    updateNodePosAddWhenNode(whenNode, parentNode)
    parentNode.childNodes.push(whenNodeId)
    addNode(whenNode)

    return [whenNode]
  }
  
  let remPos = {}
  function onNodeDragStart(e) {
    const dragNode = e.event == undefined ? e : e.nodes[0]
    remPos.layerX = dragNode.position.x
    remPos.layerY = dragNode.position.y
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
      dragAdsorption(dragNode, pos, remPos)
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
    jsonTurnNode,
  }
}
