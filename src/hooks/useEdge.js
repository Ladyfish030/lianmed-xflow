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

function addEdge(params) {
  if (isEdgeExist(params.source, params.target)) {
    return null
  }
  const edgeId = getId()
  var newEdge = {}
  newEdge = {
    id: edgeId,
    source: params.source,
    target: params.target,
    type: 'straight',
    animated: true,
  }
  edges.value.push(newEdge)
}

function findEdgeById(edgeId) {
  const edge = edges.value.find(edge => edge.id === edgeId)
  return edge
}

function edgeClick(e) {
  const edge = findEdgeById(e.edge.id)
  if (edge.label === 'YES') {
    edge.label = 'NO'
  }
  else if (edge.label === 'NO') { 
    edge.label = 'YES'
  } 
}

export { edgeClick, addEdge, edges }
