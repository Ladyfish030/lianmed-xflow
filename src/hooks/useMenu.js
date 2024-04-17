import { ref } from 'vue'
import { addNode, findNodeById } from '../hooks/useNode'

let id = 0
function getId() {
  return `copynode_${id++}`
}

const nodeMenuVisible = ref(false)
const edgeMenuVisible = ref(false)
const menuClickNode = ref(null)
const menuClickEdge = ref(null)
const menuPosition = ref({ x: 0, y: 0 })
const deleteNode = ref(null)
const deleteEdge = ref(null)
const deleteNodeConfirm = ref(false)
const copyNode = ref(null)

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

function pasteNodeHandler() {
  const queue = []

  var parentNode = copyNode.value
  var copyParentNode = deepCopy(parentNode)
  copyParentNode.id = getId()
  copyParentNode.position = {
    x: copyParentNode.position.x - copyParentNode.dimensions.width / 2,
    y: copyParentNode.position.y - copyParentNode.dimensions.height - 10
  }
  copyParentNode.parentNode = null
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
  menuClickNode,
  menuClickEdge,
  menuPosition,
  deleteNode,
  deleteEdge,
  deleteNodeConfirm,
  copyNode,
  onNodeContextMenu,
  onEdgeContextMenu,
  deleteNodeHandler,
  pasteNodeHandler,
}