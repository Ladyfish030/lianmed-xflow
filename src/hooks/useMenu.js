import { ref } from 'vue'

const nodeMenuVisible = ref(false)
const menuClickNode = ref(null)
const menuPosition = ref({ x: 0, y: 0 })
const deleteNode = ref(null)
const deleteNodeConfirm = ref(false)

function onNodeContextMenu(e) {
    nodeMenuVisible.value = true
    menuClickNode.value = e.node
    menuPosition.value = {
        x: e.event.layerX,
        y: e.event.layerY
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

export {
    nodeMenuVisible,
    menuClickNode,
    menuPosition,
    deleteNode,
    deleteNodeConfirm,
    onNodeContextMenu,
    deleteNodeHandler,
}