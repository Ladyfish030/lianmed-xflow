import { ref, reactive } from 'vue'
import useDragAndDrop from '../hooks/useDnD'

const drawer = ref(false)
const clickNode = ref({ id: '', type: '' })
const isSave = ref(false)
const saveComplete = ref(false)
const { nodes } = useDragAndDrop()

function nodeClickHandler(e) {
  drawer.value = true
  clickNode.value.id = e.node.id
  clickNode.value.type = e.node.type
}

function findClickedNode() {
  const clickedNode = nodes.value.find((node) => node.id === clickNode.value.id)
  return clickedNode
}

const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭配置栏？请注意保存配置信息')
    .then(() => {
      drawer.value = false
      done()
    })
    .catch(() => {
      // catch error
    })
}

function saveAttribute() {
  isSave.value = true
}

function saveAttributeComplete() {
  isSave.value = false
  saveComplete.value = true
}

export {
  nodeClickHandler,
  findClickedNode,
  drawer,
  clickNode,
  isSave,
  saveComplete,
  saveAttribute,
  saveAttributeComplete,
  handleClose,
}
