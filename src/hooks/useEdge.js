import { ref, h } from 'vue'
import { findNodeById } from './useNode'
let id = 0
const edges = ref([])

function getId() {
  return `dndedge_${id++}`
}

function isEdgeExist(source, target) {
  const edge = edges.value.find(
    (edge) => edge.source === source && edge.target === target
  )
  if (edge) return true
  else return false
}

function onConnect(params) {
  if (isEdgeExist(params.source, params.target)) {
    return null
  }
  const edgeId = getId()
  const newEdge = {
    id: edgeId,
    source: params.source,
    target: params.target,
    animated: true,
    style: {
      stroke: '#73767a',
      strokeWidth: 2
    }
  }

  if (findNodeById(params.source).parentNode || findNodeById(params.target).parentNode) {
      ElMessage({
        message: '提醒：不允许对群组内节点进行连线',
        type: 'warning',
      })
    return
  }
  edges.value.push(newEdge)
}

function updateEdge(nodeId) {
  let len = edges.value.length
  for (let i = 0; i < len; i++) {
    if (edges.value[i].source == nodeId || edges.value[i].target == nodeId) {
      edges.value.splice(i, 1)
      ElMessage({
        message: '提醒：不允许对群组内节点进行连线',
        type: 'warning',
      })
      len--
      i--
    }
  }
}

function findEdgeById(edgeId) {
  const edge = edges.value.find((edge) => edge.id === edgeId)
  return edge
}

function removeEdgeById(edgeId) {
  edges.value = edges.value.filter((edge) => edge.id !== edgeId)
}

export { edges, onConnect, findEdgeById, removeEdgeById, updateEdge }
