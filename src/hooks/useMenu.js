import { ref } from 'vue'
import { addNode, findNodeById, getNodeId } from '../hooks/useNode'
import { dragAdsorption, dragPasteAdsorption } from './useAdsorption'

const nodeMenuVisible = ref(false)
const edgeMenuVisible = ref(false)
const flowMenuVisible = ref(false)
const menuClickNode = ref(null)
const menuClickEdge = ref(null)
const menuPosition = ref({ x: 0, y: 0 })
const menuToFlowCoordinatePosition = ref({ x: 0, y: 0 })
const deleteNode = ref(null)
const deleteEdge = ref(null)
const deleteNodeConfirm = ref(false)
var copyNodes = []

function onNodeContextMenu(e) {
  nodeMenuVisible.value = true
  menuClickNode.value = e.node
  menuPosition.value = {
    x: e.event.layerX,
    y: e.event.layerY,
  }
}

function onEdgeContextMenu(e) {
  edgeMenuVisible.value = true
  menuClickEdge.value = e.edge
  menuPosition.value = {
    x: e.event.layerX,
    y: e.event.layerY,
  }
}

function onFlowContextMenu(e) {
  flowMenuVisible.value = true
  menuPosition.value = {
    x: e.layerX,
    y: e.layerY,
  }
}

function findCopyNodeById(nodeId) {
  const node = copyNodes.find((node) => node.id === nodeId)
  return node
}

function copyNodeHandler() {
  copyNodes = []
  var currentNode = deepCopy(menuClickNode.value)
  const queue = []
  queue.push(currentNode)
  while (queue.length > 0) {
    currentNode = queue.shift()
    copyNodes.push(currentNode)
    if (currentNode.childNodes && currentNode.childNodes.length > 0) {
      for (let i = 0; i < currentNode.childNodes.length; i++) {
        const nodeId = currentNode.childNodes[i]
        const childNode = findNodeById(nodeId)
        const copyChildNode = deepCopy(childNode)
        queue.push(copyChildNode)
      }
    }
  }
}

function pasteNodeHandler() {
  if (copyNodes.length == 0) {
    ElMessage({
      message: '请先选择要复制的节点',
      type: 'warning',
    })
    return
  }
  if (flowMenuVisible.value) {
    pasteNodeOnFlow()
  } else if (nodeMenuVisible.value) {
    pasteNodeIntoNode()
  }
}

function pasteNodeOnFlow() {
  const queue = []
  var copyParentNode = deepCopy(copyNodes[0])
  copyParentNode.id = getNodeId()
  copyParentNode.position = menuToFlowCoordinatePosition.value
  copyParentNode.parentNode = null
  copyParentNode.draggable = true
  if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
    for (let i = 0; i < copyParentNode.childNodes.length; i++) {
      const nodeId = copyParentNode.childNodes[i]
      const childNode = findCopyNodeById(nodeId)
      const copyChildNode = deepCopy(childNode)
      copyChildNode.id = getNodeId()
      copyChildNode.parentNode = copyParentNode.id
      queue.push(copyChildNode)
      copyParentNode.childNodes[i] = copyChildNode.id
    }
  }
  addNode(copyParentNode)
  var temporaryParentNode = copyParentNode

  while (queue.length > 0) {
    var parentNode = queue.shift()
    copyParentNode = deepCopy(parentNode)
    if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
      for (let i = 0; i < copyParentNode.childNodes.length; i++) {
        const nodeId = copyParentNode.childNodes[i]
        const childNode = findCopyNodeById(nodeId)
        const copyChildNode = deepCopy(childNode)
        copyChildNode.id = getNodeId()
        copyChildNode.parentNode = copyParentNode.id
        queue.push(copyChildNode)
        copyParentNode.childNodes[i] = copyChildNode.id
      }
    }
    addNode(copyParentNode)
  }

  temporaryParentNode = findNodeById(temporaryParentNode.id)
  let pos = {
    layerX: temporaryParentNode.position.x,
    layerY: temporaryParentNode.position.y,
  }
  dragAdsorption(temporaryParentNode, pos)
}

function pasteNodeIntoNode() {
  const queue = []
  var copyParentNode = deepCopy(copyNodes[0])
  copyParentNode.id = getNodeId()
  copyParentNode.parentNode = null
  copyParentNode.draggable = true
  if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
    for (let i = 0; i < copyParentNode.childNodes.length; i++) {
      const nodeId = copyParentNode.childNodes[i]
      const childNode = findCopyNodeById(nodeId)
      const copyChildNode = deepCopy(childNode)
      copyChildNode.id = getNodeId()
      copyChildNode.parentNode = copyParentNode.id
      queue.push(copyChildNode)
      copyParentNode.childNodes[i] = copyChildNode.id
    }
  }
  addNode(copyParentNode)
  var temporaryParentNode = copyParentNode

  while (queue.length > 0) {
    var parentNode = queue.shift()
    copyParentNode = deepCopy(parentNode)
    if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
      for (let i = 0; i < copyParentNode.childNodes.length; i++) {
        const nodeId = copyParentNode.childNodes[i]
        const childNode = findCopyNodeById(nodeId)
        const copyChildNode = deepCopy(childNode)
        copyChildNode.id = getNodeId()
        copyChildNode.parentNode = copyParentNode.id
        queue.push(copyChildNode)
        copyParentNode.childNodes[i] = copyChildNode.id
      }
    }
    addNode(copyParentNode)
  }

  temporaryParentNode = findNodeById(temporaryParentNode.id)
  dragPasteAdsorption(temporaryParentNode, menuClickNode.value)
}

const deleteNodeHandler = (done) => {
  ElMessageBox.confirm('确定删除该节点？')
    .then(() => {
      deleteNodeConfirm.value = true
      done()
    })
    .catch(() => {
      // catch error
    })
}

function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let copy = Array.isArray(obj) ? [] : {}

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key])
    }
  }

  return copy
}

export {
  nodeMenuVisible,
  edgeMenuVisible,
  flowMenuVisible,
  menuClickNode,
  menuClickEdge,
  menuPosition,
  menuToFlowCoordinatePosition,
  deleteNode,
  deleteEdge,
  deleteNodeConfirm,
  onNodeContextMenu,
  onEdgeContextMenu,
  onFlowContextMenu,
  deleteNodeHandler,
  copyNodeHandler,
  pasteNodeHandler,
}