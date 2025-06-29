import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { reactive } from 'vue'

// 边的响应式数组，存储所有连线
const edges = ref([])

// 生成唯一的边ID
function getEdgeId() {
  const edgeId = uuidv4()
  return edgeId
}

/**
 * 判断两节点间的边是否已存在
 * @param {string} source - 起点节点ID
 * @param {string} target - 终点节点ID
 * @returns {boolean}
 */
function isEdgeExist(source, target) {
  const edge = edges.value.find(
    (edge) => edge.source === source && edge.target === target
  )
  if (edge) return true
  else return false
}

/**
 * 添加一条新边（连线）
 * @param {string} source - 起点节点ID
 * @param {string} target - 终点节点ID
 * @param {string} sourceHandle - 起点句柄
 * @param {string} targetHandle - 终点句柄
 * @param {string} type - 连线类型，默认'straight'
 */
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

/**
 * 根据边ID查找边对象
 * @param {string} edgeId
 * @returns {object|undefined}
 */
function findEdgeById(edgeId) {
  const edge = edges.value.find((edge) => edge.id === edgeId)
  return edge
}

/**
 * 根据边ID移除边
 * @param {string} edgeId
 */
function removeEdgeById(edgeId) {
  edges.value = edges.value.filter((edge) => edge.id !== edgeId)
}

/**
 * 根据节点ID移除与该节点相关的所有边
 * @param {string} nodeId
 */
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
