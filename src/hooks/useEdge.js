import { ref } from 'vue'

let id = 0
const edges = ref([])

function getId() {
  return `dndedge_${id++}`
}

function isEdgeExist(source, target) {
  const edge = edges.value.find(edge => edge.source === source && edge.target === target)
  if (edge) 
    return true
  else
    return false
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
  }
  edges.value.push(newEdge)
}

function findEdgeById(edgeId) {
  const edge = edges.value.find(edge => edge.id === edgeId)
  return edge
}

function removeEdgeById(edgeId) {
  edges.value = edges.value.filter(edge => edge.id !== edgeId)
}

export {
  edges,
  onConnect, 
  findEdgeById,
  removeEdgeById,
}
