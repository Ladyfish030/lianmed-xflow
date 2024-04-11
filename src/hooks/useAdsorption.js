import { NodeType } from '../enums/NodeType'
import { ref, reactive } from 'vue'
import { findNodeById } from './useNode'
let parentNodePosition = []
//当拉动一个节点时需要判断是否需要吸附
function dragAdsorption(node) {
  let { x, y } = getTruePos(node)
  for (let i = parentNodePosition.length - 1; i >= 0; i--) {
    let item = parentNodePosition[i]
    if (
      x >= item.xMin &&
      x <= item.xMax &&
      y >= item.yMin &&
      y <= item.yMax &&
      node.id != item.id
    ) {
      node.position.x = x - item.xMin
      node.position.y = y - item.yMin
      node.expandParent = true
      if (node.parentNode != item.id) {
        node.parentNode = item.id
        findNodeById(node.parentNode).childNodes.push(node.id)
      }
      return
    }
  }
}
//删除节点
function removeParentNode(adsorption, id) {
  if (adsorption) {
    for (let i = 0, len = parentNodePosition.length; i < len; i++) {
      if (parentNodePosition[i].id == id) {
        parentNodePosition.splice(i, 1)
        break
      }
    }
  }
}
//更新parentNodePosition
function updateParentNode(node) {
  //全部更新版本
  // parentNodePosition = []
  // for (let node of nodes) {
  //   if (node.adsorption) {
  //     let pos = {
  //       xMin: node.position.x,
  //       xMax: node.position.x + node.dimensions.width,
  //       yMin: node.position.y,
  //       yMax: node.position.y + node.dimensions.height,
  //       id: node.id,
  //     }
  //     parentNodePosition.push(pos)
  //   }
  // }

  //只更新新增节点版本
  if (node.adsorption) {
    let { x, y } = getTruePos(node)
    //情况一，这个节点原来就在parentNode数组中，则进行更新
    for (let item of parentNodePosition) {
      if (item.id == node.id) {
        item.xMin = x
        item.xMax = x + node.dimensions.width
        item.yMin = y
        item.yMax = y + node.dimensions.height
        if (node.parentNode) {
          updateParentNode(findNodeById(node.parentNode))
        }
        return
      }
    }
    //情况二，新增parentNodePos
    let pos = {
      xMin: x,
      xMax: x + node.dimensions.width,
      yMin: y,
      yMax: y + node.dimensions.height,
      id: node.id,
    }
    parentNodePosition.push(pos)
  }
}
function getTruePos(node) {
  if (node.parentNode) {
    let { x, y } = getTruePos(findNodeById(node.parentNode))
    return {
      x: node.position.x + x,
      y: node.position.y + y,
    }
  } else {
    return {
      x: node.position.x,
      y: node.position.y,
    }
  }
}
export { dragAdsorption, removeParentNode, updateParentNode }
