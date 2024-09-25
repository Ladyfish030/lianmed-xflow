import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'

const edges = ref([])

function getEdgeId() {
  const edgeId = uuidv4()
  return edgeId
}

function isEdgeExist(source, target) {
  const edge = edges.value.find(
    (edge) => edge.source === source && edge.target === target
  )
  if (edge) return true
  else return false
}

function addEdge(source, target, sourceHandle, targetHandle, type = 'straight') {
    if (isEdgeExist(source, target)) {
        return null
      }
      const edgeId = getEdgeId()
      const newEdge = reactive({
        id: edgeId,
        source: source,
        target: target,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle,
        style: {
          stroke: '#73767a',
          strokeWidth: 2,
          },
        type: type
      })
    
      edges.value.push(newEdge)
}

function findEdgeById(edgeId) {
  const edge = edges.value.find((edge) => edge.id === edgeId)
  return edge
}

function removeEdgeById(edgeId) {
  edges.value = edges.value.filter((edge) => edge.id !== edgeId)
}

function removeEdgeByNodeId(nodeId) {
  edges.value = edges.value.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
}

export {
  edges,
  findEdgeById,
  removeEdgeById,
  removeEdgeByNodeId,
  addEdge,
}
