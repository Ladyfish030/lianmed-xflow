import { ref, h } from 'vue'
import { ElNotification } from 'element-plus'
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
    type: 'straight',
    animated: true,
  }

  if (
    findNodeById(params.source).parentNode ||
    findNodeById(params.target).parentNode
  ) {
    ElNotification({
      title: '提示',
      message: h('i', { style: 'color: teal' }, '不允许对群组内节点进行连线'),
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
      ElNotification({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '不允许对群组内节点进行连线'),
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

export { findEdgeById, onConnect, edges, updateEdge }
