import { ref } from 'vue'

const drawer = ref(false)
const clickNode = ref({})
const isSave = ref(false)
const saveComplete = ref(false)

function nodeClickHandler() {
  drawer.value = true
}

const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭配置栏？请注意保存配置信息')
    .then(() => {
      drawer.value = false
      clickNode.value = {}
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
  drawer,
  clickNode,
  isSave,
  saveComplete,
  saveAttribute,
  saveAttributeComplete,
  handleClose
}
