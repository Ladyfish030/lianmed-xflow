import { ref } from 'vue'
import { addNode, findNodeById, findAbsolutePositionByNodeId } from '../hooks/useNode'
import { dragAdsorption } from './useAdsorption'

let id = 0

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
const copyNode = ref(null)

function getId() {
  return `copynode_${id++}`
}

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

function pasteNodeHandler() {
  if (copyNode.value == null) {
    ElMessage({
      message: '请先选择要复制的节点',
      type: 'warning',
    })
    return
  }
  if (flowMenuVisible.value) {
    pasteNodeOnFlow()
  }
  else if (nodeMenuVisible.value) {
    pasteNodeIntoNode()
  }
}

function pasteNodeOnFlow() {
  const queue = []
  var parentNode = copyNode.value
  var copyParentNode = deepCopy(parentNode)
  copyParentNode.id = getId()
  copyParentNode.position = menuToFlowCoordinatePosition.value
  copyParentNode.parentNode = null
  copyParentNode.draggable = true
  if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
    for (let i = 0; i < copyParentNode.childNodes.length; i++) {
      const nodeId = copyParentNode.childNodes[i]
      const childNode = findNodeById(nodeId)
      const copyChildNode = deepCopy(childNode)
      copyChildNode.id = getId()
      copyChildNode.parentNode = copyParentNode.id
      queue.push(copyChildNode)
      copyParentNode.childNodes[i] = copyChildNode.id
    }
  }
  addNode(copyParentNode)

  while (queue.length > 0) {
    parentNode = queue.shift()
    copyParentNode = deepCopy(parentNode)
    if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
      for (let i = 0; i < copyParentNode.childNodes.length; i++) {
        const nodeId = copyParentNode.childNodes[i]
        const childNode = findNodeById(nodeId)
        const copyChildNode = deepCopy(childNode)
        copyChildNode.id = getId()
        copyChildNode.parentNode = copyParentNode.id
        queue.push(copyChildNode)
        copyParentNode.childNodes[i] = copyChildNode.id
      }
    }
    addNode(copyParentNode)
  }
}

function pasteNodeIntoNode() {
  const queue = []
  var parentNode = copyNode.value
  var copyParentNode = deepCopy(parentNode)
  copyParentNode.id = getId()
  copyParentNode.parentNode = null
  copyParentNode.draggable = true
  if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
    for (let i = 0; i < copyParentNode.childNodes.length; i++) {
      const nodeId = copyParentNode.childNodes[i]
      const childNode = findNodeById(nodeId)
      const copyChildNode = deepCopy(childNode)
      copyChildNode.id = getId()
      copyChildNode.parentNode = copyParentNode.id
      queue.push(copyChildNode)
      copyParentNode.childNodes[i] = copyChildNode.id
    }
  }
  addNode(copyParentNode)
  var temporaryParentNode = copyParentNode

  while (queue.length > 0) {
    parentNode = queue.shift()
    copyParentNode = deepCopy(parentNode)
    if (copyParentNode.childNodes && copyParentNode.childNodes.length > 0) {
      for (let i = 0; i < copyParentNode.childNodes.length; i++) {
        const nodeId = copyParentNode.childNodes[i]
        const childNode = findNodeById(nodeId)
        const copyChildNode = deepCopy(childNode)
        copyChildNode.id = getId()
        copyChildNode.parentNode = copyParentNode.id
        queue.push(copyChildNode)
        copyParentNode.childNodes[i] = copyChildNode.id
      }
    }
    addNode(copyParentNode)
  }

  const absolutePosition = findAbsolutePositionByNodeId(menuClickNode.value.id)
  let pos = {
    layerX: absolutePosition.x,
    layerY: absolutePosition.y
  }
  temporaryParentNode = findNodeById(temporaryParentNode.id)
  dragAdsorption(temporaryParentNode, pos)
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
    return obj;
  }

  let copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopy(obj[key]);
    }
  }

  return copy;
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
  copyNode,
  onNodeContextMenu,
  onEdgeContextMenu,
  onFlowContextMenu,
  deleteNodeHandler,
  pasteNodeHandler,
}