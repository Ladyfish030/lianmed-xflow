import { ref } from 'vue'

const nodeInformationDrawerVisible = ref(false)
const haveEdited = ref(false)
const saveComplete = ref(false)
const drawerClickNode = ref({})

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