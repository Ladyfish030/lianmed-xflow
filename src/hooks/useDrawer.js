import { ref } from 'vue'
const drawer = ref(false)
const direction = ref('rtl')
function nodeClickHandler(e) {
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
export { nodeClickHandler, drawer, direction, handleClose }
