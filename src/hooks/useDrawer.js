import { ref, reactive } from 'vue'
const drawer = ref(false)
let node = {}
let propertyList = reactive([])
function nodeClickHandler(e) {
  node = e.node
  propertyList = e.node.property
  // let nodeType = e.node.nodeType //database

  drawer.value = true
}

const handleClose = (done) => {
  done()
}
function cancelClick() {
  drawer.value = false
}
function nodePropertyChange() {
  node.label = propertyList['组件名'] == '' ? node.id : propertyList['组件名']
}
export {
  nodeClickHandler,
  drawer,
  handleClose,
  propertyList,
  nodePropertyChange,
}
