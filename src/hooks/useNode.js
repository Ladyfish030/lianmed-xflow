import useDragAndDrop from '../hooks/useDnD'

const { nodes } = useDragAndDrop()

function nodeContextMenu(event) {
    console.log(event)
}

function findNodeById(nodeId) {
    const node = nodes.value.find(node => node.id === nodeId)
    return node
}

export { findNodeById, nodeContextMenu }