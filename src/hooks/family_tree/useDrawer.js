import { ref } from 'vue'

const nodeInformationDrawerVisible = ref(false)
const haveEdited = ref(false)
const saveComplete = ref(false)
const drawerClickNode = ref({})

/**
 * 节点点击事件处理，打开节点信息抽屉
 */
function onNodeClickHandler() {
    nodeInformationDrawerVisible.value = true
}

export {
    nodeInformationDrawerVisible,
    haveEdited,
    saveComplete,
    drawerClickNode,
    onNodeClickHandler,
}