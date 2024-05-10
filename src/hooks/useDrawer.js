import { ref } from 'vue'

const drawer = ref(false)
const drawerClickNode = ref({})
const isSave = ref(false)
const saveComplete = ref(false)

function onNodeDoubleClick() {
  drawer.value = true
}

const handleClose = (done) => {
  ElMessageBox.confirm(
    '确定关闭配置栏？请注意保存配置信息',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      drawer.value = false
      drawerClickNode.value = {}
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
  onNodeDoubleClick,
  drawer,
  drawerClickNode,
  isSave,
  saveComplete,
  saveAttribute,
  saveAttributeComplete,
  handleClose
}
