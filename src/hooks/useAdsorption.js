import { NodeType } from '../enums/NodeType'
import { findNodeById } from './useNode'
import { updateEdge } from './useEdge'

//存储吸附位置
let parentNodePosition = []

//拉动节点判断是否进行吸附
function dragAdsorption(node, pos) {
  if (
    node.type == NodeType.CHOICEWHEN ||
    node.type == NodeType.CHOICEDEFAULT ||
    node.type == NodeType.SUBFLOW
  ) {
    return
  }
  if (node.type == NodeType.CHOICE || node.adsorption) {
    updateParentNode(node) //更新祖上节点的parentNodePos和位置
    // updateChildNodeAdsorptionPos(node) //更新孩子节点的parentNodePos
  }
  for (let i = parentNodePosition.length - 1; i >= 0; i--) {
    let item = parentNodePosition[i]
    if (
      pos.layerX >= item.xMin &&
      pos.layerX <= item.xMax &&
      pos.layerY >= item.yMin &&
      pos.layerY <= item.yMax &&
      node.id != item.id &&
      node.parentNode != item.id
      // &&
      // !isChild(node, item.id)
    ) {
      let parentNode = findNodeById(item.id)
      let { width, height } = getLastPos(node, parentNode) //放置新节点的位置
      node.draggable = false
      node.parentNode = item.id
      updateEdge(node.id) //处理连线
      parentNode.childNodes.push(node.id)
      //更新父节点的大小
      updateParentNodeStyle(node, parentNode, width, height)
      updateParentNode(node) //更新祖上节点的parentNodePos和位置
      // updateChildNodeAdsorptionPos(node) //更新孩子节点的parentNodePos
      return
    }
  }
}
//粘贴节点 一定吸附 node：需要吸附的copy节点 parentNode:被吸附的节点
function dragPasteAdsorption(node, parentNode) {
  if (node.type == NodeType.SUBFLOW) {
    ElMessage({
      message: '子流程节点不可被群组节点吸附',
      type: 'warning',
    })
    return
  }
  let { width, height } = getLastPos(node, parentNode) //放置新节点的位置
  node.draggable = false
  node.parentNode = parentNode.id
  updateEdge(node.id) //处理连线
  parentNode.childNodes.push(node.id)
  //更新父节点的大小
  updateParentNodeStyle(node, parentNode, width, height)
  updateParentNode(node) //更新祖上节点的parentNodePos和位置
}
function isChild(node, isChildId) {
  if (node.adsorption || node.type == NodeType.CHOICE) {
    for (let childNodeId of node.childNodes) {
      if (childNodeId == isChildId) {
        //则不考虑这个item
        return true
      }
    }
  }
  return false
}
//由于子节点的position是相对父节点的，该函数可以拿到子节点真正的position
function getTruePos(node, parentNode) {
  if (node.parentNode) {
    let x, y
    if (parentNode) {
      let pos = getTruePos(parentNode)
      x = pos.x
      y = pos.y
    } else {
      let pos = getTruePos(findNodeById(node.parentNode))
      x = pos.x
      y = pos.y
    }
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
//放置最新节点的位置
function getLastPos(node, parentNode) {
  if (parentNode.type == NodeType.CHOICE) {
  } else {
    let [x, y] = [20, 30]
    let len = parentNode.childNodes.length
    if (len > 0) {
      let lastNode = findNodeById(parentNode.childNodes[len - 1])
      x = lastNode.position.x + parseInt(lastNode.style.width) + 20
    }
    node.position.x = x
    node.position.y = y
    let parentWidth = x + parseInt(node.style.width) + 20
    let parentHeight = y + parseInt(node.style.height) + 30
    return {
      width: parentWidth - parseInt(parentNode.style.width),
      height: parentHeight - parseInt(parentNode.style.height),
    }
  }
}
//往上祖先更新可吸附的parentNodePosition
function updateParentNode(node, parentNode) {
  //只更新新增choicedefault节点版本
  parentNode = parentNode || undefined
  //如果是choice，则跳过这个node继续往上更新
  if (node.type == NodeType.CHOICE) {
    if (node.parentNode) {
      let parentNode = findNodeById(node.parentNode)
      updateParentNode(parentNode)
    } else {
      updateChildNodeAdsorptionPos(node)
    }
    return
  }
  if (node.adsorption) {
    let { x, y } = getTruePos(node, parentNode)
    //情况一，这个节点原来就在parentNode数组中，并且有变化，则进行递归更新
    for (let item of parentNodePosition) {
      if (item.id == node.id) {
        if (
          item.xMin != x ||
          item.xMax != x + parseInt(node.style.width) ||
          item.yMin != y ||
          item.yMax != y + parseInt(node.style.height)
        ) {
          item.xMin = x
          item.xMax = x + parseInt(node.style.width)
          item.yMin = y
          item.yMax = y + parseInt(node.style.height)
          //递归调用更新parentNodePos的同时更新这些节点的大小
          if (parentNode) {
            updateParentNode(parentNode)
          } else if (node.parentNode) {
            updateParentNode(findNodeById(node.parentNode))
          } else {
            updateChildNodeAdsorptionPos(node)
          }
        }
        return
      }
    }
    //情况二，新增parentNodePos
    let pos = {
      xMin: x,
      xMax: x + parseInt(node.style.width),
      yMin: y,
      yMax: y + parseInt(node.style.height),
      id: node.id,
    }
    parentNodePosition.push(pos)
    if (parentNode) {
      updateParentNode(parentNode)
    } else if (node.parentNode) {
      updateParentNode(findNodeById(node.parentNode))
    } else {
      updateChildNodeAdsorptionPos(node)
    }
  }
}
//往下孩子更新可吸附的parentNodePosition
function updateChildNodeAdsorptionPos(node) {
  let childNodes = node.childNodes
  if (!childNodes) {
    return
  }
  for (let i of childNodes) {
    let childNode = findNodeById(i)
    if (!childNode) {
      return
    }
    if (childNode.adsorption) {
      let isHasParentPos = false
      let { x, y } = getTruePos(childNode)
      for (let item of parentNodePosition) {
        if (item.id == childNode.id) {
          //说明原来就存在于parentNodePosition中
          isHasParentPos = true
          if (
            item.xMin != x ||
            item.xMax != x + parseInt(childNode.style.width) ||
            item.yMin != y ||
            item.yMax != y + parseInt(childNode.style.height)
          ) {
            //递归调用更新parentNodePos的同时更新这些节点的大小
            item.xMin = x
            item.xMax = x + parseInt(childNode.style.width)
            item.yMin = y
            item.yMax = y + parseInt(childNode.style.height)
            updateChildNodeAdsorptionPos(childNode)
            break
          }
        }
      }
      if (!isHasParentPos) {
        let pos = {
          xMin: x,
          xMax: x + parseInt(childNode.style.width),
          yMin: y,
          yMax: y + parseInt(childNode.style.height),
          id: childNode.id,
        }
        parentNodePosition.push(pos)
        updateChildNodeAdsorptionPos(childNode)
      }
    } else if (childNode.type == NodeType.CHOICE) {
      updateChildNodeAdsorptionPos(childNode)
    }
  }
}
//往上祖先递归更新样式大小
function updateParentNodeStyle(node, parentNode, width, height) {
  if (parentNode.type == NodeType.CHOICE) {
    height = updateHeightChoice(node, parentNode, height)
    width = updateWidthChoice(parentNode)
  } else {
    height = updateHeightExceptChoice(parentNode, node)
    width = updateWidthExceptChoice(node, parentNode, width)
  }
  if (parentNode.parentNode) {
    updateParentNodeStyle(
      parentNode,
      findNodeById(parentNode.parentNode),
      width,
      height
    )
  }
}
function updateHeightChoice(node, parentNode, height) {
  let childNodes = parentNode.childNodes
  let len = childNodes.length
  let index = childNodes.findIndex((i) => i == node.id) + 1
  if (index != 0) {
    for (; index < len; index++) {
      let childNode = findNodeById(childNodes[index])
      childNode.position.y += height
    }
  }

  if (
    parseInt(parentNode.style.height) + height <
    parentNode.initDimensions.height
  ) {
    height =
      parentNode.initDimensions.height - parseInt(parentNode.style.height)
    parentNode.style.height = parentNode.initDimensions.height + 'px'
  } else {
    parentNode.style.height = parseInt(parentNode.style.height) + height + 'px'
  }
  return height
}
function updateWidthChoice(parentNode) {
  let childNodes = parentNode.childNodes
  let maxWidth = 0
  let childNode
  for (let item of childNodes) {
    childNode = findNodeById(item)
    if (parseInt(childNode.style.width) + 70 > maxWidth) {
      maxWidth = parseInt(childNode.style.width) + 70
    }
  }
  let oldWidth = parseInt(parentNode.style.width)
  if (maxWidth > parentNode.initDimensions.width) {
    parentNode.style.width = maxWidth + 'px'
  } else {
    parentNode.style.width = parentNode.initDimensions.width + 'px'
  }
  let changeWidth = parseInt(parentNode.style.width) - oldWidth
  return changeWidth
}
//删除和不删除更新区别在于是否考虑当前节点的大小
function updateDeleteWidthChoice(parentNode, node) {
  let childNodes = parentNode.childNodes
  let maxWidth = 0
  let childNode
  for (let item of childNodes) {
    if (item != node.id) {
      childNode = findNodeById(item)
      if (parseInt(childNode.style.width) + 70 > maxWidth) {
        maxWidth = parseInt(childNode.style.width) + 70
      }
    }
  }
  let oldWidth = parseInt(parentNode.style.width)
  if (maxWidth > parentNode.initDimensions.width) {
    parentNode.style.width = maxWidth + 'px'
  } else {
    parentNode.style.width = parentNode.initDimensions.width + 'px'
  }
  let changeWidth = parseInt(parentNode.style.width) - oldWidth
  return changeWidth
}
function updateHeightExceptChoice(parentNode, node) {
  let childNodes = parentNode.childNodes
  let maxHeight = 0
  let childNode
  for (let item of childNodes) {
    if (node && item == node.id) {
      childNode = node
    } else {
      childNode = findNodeById(item)
    }
    if (parseInt(childNode.style.height) + 50 > maxHeight) {
      maxHeight = parseInt(childNode.style.height) + 50
    }
  }
  let oldHeight = parseInt(parentNode.style.height)
  if (maxHeight > parentNode.initDimensions.height) {
    parentNode.style.height = maxHeight + 'px'
  } else {
    parentNode.style.height = parentNode.initDimensions.height + 'px'
  }
  let changeHeight = parseInt(parentNode.style.height) - oldHeight
  return changeHeight
}
function updateDeleteHeightExceptChoice(parentNode, node) {
  let childNodes = parentNode.childNodes
  let maxHeight = 0
  let childNode
  for (let item of childNodes) {
    if (item != node.id) {
      childNode = findNodeById(item)
      if (parseInt(childNode.style.height) + 50 > maxHeight) {
        maxHeight = parseInt(childNode.style.height) + 50
      }
    }
  }
  let oldHeight = parseInt(parentNode.style.height)
  if (maxHeight > parentNode.initDimensions.height) {
    parentNode.style.height = maxHeight + 'px'
  } else {
    parentNode.style.height = parentNode.initDimensions.height + 'px'
  }
  let changeHeight = parseInt(parentNode.style.height) - oldHeight
  return changeHeight
}
function updateWidthExceptChoice(node, parentNode, width) {
  let childNodes = parentNode.childNodes
  let len = childNodes.length
  let index = childNodes.findIndex((i) => i == node.id) + 1
  if (index != 0) {
    for (; index <= len - 1; index++) {
      let childNode = findNodeById(childNodes[index])
      childNode.position.x += width
    }
  }
  if (
    parseInt(parentNode.style.width) + width <
    parentNode.initDimensions.width
  ) {
    width = parentNode.initDimensions.width - parseInt(parentNode.style.width)
    parentNode.style.width = parentNode.initDimensions.width + 'px'
  } else {
    parentNode.style.width = parseInt(parentNode.style.width) + width + 'px'
  }
  return width
}
function updateNodePosAddWhenNode(whenNode, parentNode) {
  let { x, y } = getTruePos(whenNode)
  let pos = {
    xMin: x,
    xMax: x + whenNode.dimensions.width,
    yMin: y,
    yMax: y + whenNode.dimensions.height,
    id: whenNode.id,
  }
  parentNodePosition.push(pos)
  updateParentNodeStyle(
    whenNode,
    parentNode,
    0,
    whenNode.dimensions.height + 20
  )
  updateParentNode(parentNode) //更新祖上节点的parentNodePos和位置
  updateChildNodeAdsorptionPos(whenNode) //更新孩子节点的parentNodePos
}
//删除节点
function removeNodeAdsorption(deleteNodeId) {
  // console.log('进来删除节点')
  let node = findNodeById(deleteNodeId)
  if (node.parentNode) {
    let parentNode = findNodeById(node.parentNode)
    updateDeleteParentNodeStyle(
      node,
      parentNode,
      0 - parseInt(node.style.width) - 20,
      0 - parseInt(node.style.height) - 20
    )
    parentNode.childNodes.splice(
      parentNode.childNodes.findIndex((i) => i == deleteNodeId),
      1
    )
  }
  removeParentNode(node)
}
//删除可吸附节点
function removeParentNode(node) {
  if (node.adsorption) {
    for (let i = 0, len = parentNodePosition.length; i < len; i++) {
      if (parentNodePosition[i].id == node.id) {
        parentNodePosition.splice(i, 1)
        let childNodes = node.childNodes
        for (let item of childNodes) {
          removeParentNode(findNodeById(item))
        }
        return
      }
    }
  } else if (node.type == NodeType.CHOICE) {
    let childNodes = node.childNodes
    for (let item of childNodes) {
      removeParentNode(findNodeById(item))
    }
  }
}
//删除节点时往上祖先更新样式大小
function updateDeleteParentNodeStyle(node, parentNode, width, height) {
  if (parentNode.type == NodeType.CHOICE) {
    height = updateHeightChoice(node, parentNode, height)
    width = updateDeleteWidthChoice(parentNode, node)
  } else {
    height = updateDeleteHeightExceptChoice(parentNode, node)
    width = updateWidthExceptChoice(node, parentNode, width)
  }
  if (parentNode.parentNode) {
    // console.log(parentNode)
    updateParentNodeStyle(
      parentNode,
      findNodeById(parentNode.parentNode),
      width,
      height
    )
  }
}
function getParentPos() {
  return parentNodePosition
}
function setParentPos(value) {
  parentNodePosition = value || []
}
export {
  dragAdsorption,
  removeNodeAdsorption,
  updateParentNode,
  updateNodePosAddWhenNode,
  getParentPos,
  setParentPos,
  dragPasteAdsorption,
}
