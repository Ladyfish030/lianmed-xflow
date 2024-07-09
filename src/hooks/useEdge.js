import { ref } from 'vue'
import { findNodeById } from './useNode'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'
const edges = ref([])
import { useVueFlow } from '@vue-flow/core'
const { addEdges } = useVueFlow()
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
function findEdgeBySourceTarget(source, target) {
  const edge = edges.value.find(
    (edge) => edge.source === source && edge.target === target
  )
  if (edge) return edge
  else return undefined
}
function findEdgeBySource(source) {
  const edge = edges.value.find((edge) => edge.source === source)
  if (edge) return edge
  else return undefined
}
function findEdgeByTarget(target) {
  const edge = edges.value.find((edge) => edge.target === target)
  if (edge) return edge
  else return undefined
}
function onConnect(params) {
  if (isEdgeExist(params.source, params.target)) {
    return null
  }
  const edgeId = getEdgeId()
  const newEdge = reactive({
    id: edgeId,
    source: params.source,
    target: params.target,
    animated: true,
    style: {
      stroke: '#73767a',
      strokeWidth: 2,
    },
  })

  // if (
  //   findNodeById(params.source).parentNode ||
  //   findNodeById(params.target).parentNode
  // ) {
  //   ElMessage({
  //     message: '提醒：不允许对群组内节点进行连线',
  //     type: 'warning',
  //   })
  //   return
  // }
  edges.value.push(newEdge)
  addEdges(newEdge)
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

export {
  edges,
  onConnect,
  findEdgeById,
  removeEdgeById,
  updateEdge,
  findEdgeBySource,
  findEdgeByTarget,
  findEdgeBySourceTarget,
}
