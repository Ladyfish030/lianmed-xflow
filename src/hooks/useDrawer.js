import { ref } from 'vue'

const drawer = ref(false)
const drawerClickNode = ref({})
const isSave = ref(false)
const saveComplete = ref(false)
const haveEdited = ref(false)

function onNodeDoubleClick() {
  drawer.value = true
}

const handleClose = (done) => {
  if (haveEdited.value === true) {
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
        haveEdited.value = false
        done()
      })
      .catch(() => {
        // catch error
      })
  }
  else {
    drawer.value = false
    drawerClickNode.value = {}
  }
}

function saveAttribute() {
  isSave.value = true
  saveComplete.value = false
}

function saveAttributeComplete() {
  isSave.value = false
  saveComplete.value = true
  haveEdited.value = false
}

export {
  onNodeDoubleClick,
  drawer,
  drawerClickNode,
  isSave,
  saveComplete,
  haveEdited,
  saveAttribute,
  saveAttributeComplete,
  handleClose
}
