import { ref, reactive } from 'vue'
const drawer = ref(false)
let propertyList = reactive([])
function nodeClickHandler(e) {
  console.log('====================================')
  console.log(e)
  console.log(e.node.label)
  propertyList = e.node.property
  console.log('====================================')
  console.log(propertyList)
  console.log('====================================')
  console.log('====================================')
  drawer.value = true
  console.log('====================================')
  console.log('画布上的节点被点击')
  console.log('====================================')
}

const handleClose = (done) => {
  done()
}
function cancelClick() {
  drawer.value = false
}
export { nodeClickHandler, drawer, handleClose, propertyList }
