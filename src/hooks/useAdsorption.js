import { NodeType } from '../enums/NodeType'
import { ref, reactive } from 'vue'
import { findNodeById, nodes } from './useNode'
import { updateEdge } from './useEdge'

let parentNodePosition = []
//当拉动一个节点时需要判断是否需要吸附
function dragAdsorption(node, pos) {
  if (node.type == NodeType.CHOICEWHEN || node.type == NodeType.CHOICEDEFAULT) {
    return
  }
  if (node.type == NodeType.CHOICE || node.adsorption) {
    updateParentNode(node) //更新祖上节点的parentNodePos和位置
    updateChildNodeAdsorptionPos(node) //更新孩子节点的parentNodePos
  }
  for (let i = parentNodePosition.length - 1; i >= 0; i--) {
    let item = parentNodePosition[i]
    if (
      pos.layerX >= item.xMin &&
      pos.layerX <= item.xMax &&
      pos.layerY >= item.yMin &&
      pos.layerY <= item.yMax &&
      node.id != item.id &&
      node.parentNode != item.id &&
      node.type != NodeType.CHOICEDEFAULT &&
      node.type != NodeType.CHOICEWHEN
    ) {
      let parentNode = findNodeById(item.id)
      getLastPos(node, parentNode) //放置新节点的位置
      node.draggable = false
      node.parentNode = item.id
      updateEdge(node.id)
      parentNode.childNodes.push(node.id)
      //更新父节点的大小
      updateAddNodeStyleExceptChoice(node, parentNode)
      updateParentNodeHeight(parentNode, node)
      updateParentNode(parentNode) //更新祖上节点的parentNodePos和位置
      updateChildNodeAdsorptionPos(node) //更新孩子节点的parentNodePos
      return
    }
  }
}
//删除节点
function removeNodeAdsorption(deleteNodeId) {
  let node = findNodeById(deleteNodeId)
  if (node.parentNode) {
    let parentNode = findNodeById(node.parentNode)
    updateDeleteNodeStyleWidthExceptChoice(
      node,
      parentNode,
      parseInt(node.style.width) + 20
    )
    parentNode.childNodes.splice(
      parentNode.childNodes.findIndex((i) => i == deleteNodeId),
      1
    )
    updateDeleteParentNodeHeight(parentNode, node)
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
//更新可吸附的parentNodePosition
function updateParentNode(node, parentNode) {
  //只更新新增choicedefault节点版本
  parentNode = parentNode || undefined
  //如果是choice，那么更新所有子节点的吸附位置
  if (node.parentNode && node.type == NodeType.CHOICE) {
    let parentNode = findNodeById(node.parentNode)
    updateParentNode(parentNode)

    return
  }
  if (node.adsorption) {
    let { x, y } = getTruePos(node, parentNode)
    //情况一，这个节点原来就在parentNode数组中，则进行更新
    for (let item of parentNodePosition) {
      if (item.id == node.id) {
        item.xMin = x
        item.xMax = x + parseInt(node.style.width)
        item.yMin = y
        item.yMax = y + parseInt(node.style.height)
        //递归调用更新parentNodePos的同时更新这些节点的大小
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
function updateChildNodeAdsorptionPos(node) {
  let childNodes = node.childNodes
  if (!childNodes) {
    return
  }
  for (let i of childNodes) {
    let childNode = findNodeById(i)
    if (childNode.adsorption) {
      for (let item of parentNodePosition) {
        if (item.id == childNode.id) {
          let { x, y } = getTruePos(childNode)
          item.xMin = x
          item.xMax = x + parseInt(childNode.style.width)
          item.yMin = y
          item.yMax = y + parseInt(childNode.style.height)
          //递归调用更新parentNodePos的同时更新这些节点的大小
          updateChildNodeAdsorptionPos(childNode)
        }
      }
    } else if (childNode.type == NodeType.CHOICE) {
      let choiceChildNodes = childNode.childNodes
      for (let i of choiceChildNodes) {
        updateChildNodeAdsorptionPos(findNodeById(i))
      }
    }
  }
}
//由于子节点的position是相对父节点的，该函数可以拿到子节点争取的position
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
  }
}
function updateParentNodeStyle1(node, parentNode, changeWidth) {
  if (parentNode.type != NodeType.CHOICE) {
    let x = node.position.x
    if (!changeWidth) {
      //没有传递changeWidth说明是新增节点
      changeWidth =
        x + parseInt(node.style.width) + 20 - parseInt(parentNode.style.width)
      parentNode.style.width = x + parseInt(node.style.width) + 20 + 'px'
      parentNode.style.height =
        parseInt(parentNode.style.height) < parseInt(node.style.height) + 50
          ? parseInt(node.style.height) + 50 + 'px'
          : parentNode.style.height
    } else {
      //改变了的这个节点不是新增的
      let childNodes = parentNode.childNodes
      let len = childNodes.length
      if (
        len > 2 &&
        node.id != parentNode.childNodes[parentNode.childNodes.length - 1]
      ) {
        let index = childNodes.find(node.id) + 1
        for (; index < len - 1; index++) {
          let childNode = findNodeById(childNodes[index])
          childNode.position.x += changeWidth
        }
        parentNode.style.width =
          parseInt(parentNode.style.width) + changeWidth + 'px'
      }
    }
  } else {
    //choice的是不同方向的
    return
  }

  if (parentNode.parentNode) {
    updateParentNodeStyle(
      parentNode,
      findNodeById(parentNode.parentNode),
      changeWidth
    )
  }
}
//changeStyle：父节点相对于原来需要新增的宽高，初始都为0
//没有变化为负值，无需继续递归，直接退出
//正常情况下为正值，表示大小有变化继续往上递归
function updateAddNodeStyleExceptChoice(node, parentNode, changeStyle) {
  if (parentNode.type == NodeType.CHOICE) {
    //choice的高度更新操作
    updateAddNodeStyleHeightChoice(node, parentNode, changeStyle)
    updateParentNodeHeight(parentNode, node)
    return
  }
  let childNodes = parentNode.childNodes
  let len = childNodes.length
  if (len > 1 && node.id != childNodes[len - 1]) {
    let index = childNodes.findIndex((i) => i == node.id) + 1
    for (; index <= len - 1; index++) {
      let childNode = findNodeById(childNodes[index])
      childNode.position.x += changeStyle.width
    }
  }
  if (!changeStyle) {
    //新增节点初始化，没有变化值
    //宽度
    changeStyle = { height: 0 }
    if (len <= 1) {
      let oldWidth = parseInt(parentNode.style.width)
      parentNode.style.width = 20 + parseInt(node.style.width) + 20 + 'px'
      changeStyle.width = parseInt(parentNode.style.width) - oldWidth
    } else {
      let oldWidth = parseInt(parentNode.style.width)
      parentNode.style.width = oldWidth + parseInt(node.style.width) + 20 + 'px'
      changeStyle.width = parseInt(node.style.width) + 20
    }
    //高度
    // parentNode.style.height =
    //   parseInt(parentNode.style.height) < parseInt(node.style.height) + 50
    //     ? parseInt(node.style.height) + 50 + 'px'
    //     // : parentNode.style.height
    if (parseInt(parentNode.style.height) < parseInt(node.style.height) + 50) {
      let oldHeight = parseInt(parentNode.style.height)
      parentNode.style.height = parseInt(node.style.height) + 50 + 'px'
      changeStyle.height = parseInt(parentNode.style.height) - oldHeight
    }
  } else if (changeStyle.width != 0) {
    parentNode.style.width =
      parseInt(parentNode.style.width) + changeStyle.width + 'px'
  }
  if (parentNode.parentNode) {
    updateAddNodeStyleExceptChoice(
      parentNode,
      findNodeById(parentNode.parentNode),
      changeStyle
    )
  }
}
function updateAddNodeStyleHeightChoice(node, parentNode, changeStyle) {
  let childNodes = parentNode.childNodes
  let len = childNodes.length
  if (changeStyle.height != 0) {
    if (len > 1 && node.id != childNodes[len - 1]) {
      let index = childNodes.findIndex((i) => i == node.id) + 1
      for (; index <= len - 1; index++) {
        let childNode = findNodeById(childNodes[index])
        childNode.position.y += changeStyle.height
      }
    }
    parentNode.style.height =
      parseInt(parentNode.style.height) + changeStyle.height + 'px'
  }
  if (parentNode.parentNode) {
    updateAddNodeStyleExceptChoice(
      parentNode,
      findNodeById(parentNode.parentNode),
      changeStyle
    )
  }
}
//删除节点更新宽度
function updateDeleteNodeStyleWidthExceptChoice(node, parentNode, width) {
  if (parentNode.type == NodeType.CHOICE) {
    return
  }

  let childNodes = parentNode.childNodes
  let len = childNodes.length
  if (len > 1 && node.id != childNodes[len - 1]) {
    let index = childNodes.findIndex((i) => i == node.id) + 1
    for (; index <= len - 1; index++) {
      let childNode = findNodeById(childNodes[index])
      childNode.position.x -= width
    }
  }
  if (
    parseInt(parentNode.style.width) - width <
    parentNode.initDimensions.width
  ) {
    width = parseInt(parentNode.style.width) - parentNode.initDimensions.width
    parentNode.style.width = parentNode.initDimensions.width + 'px'
  } else {
    parentNode.style.width = parseInt(parentNode.style.width) - width + 'px'
  }

  if (parentNode.parentNode) {
    updateDeleteNodeStyleWidthExceptChoice(
      parentNode,
      findNodeById(parentNode.parentNode),
      width
    )
  }
}
function updateDeleteNodeStyleHeightChoice(node, parentNode) {}
//节点更新choice更新宽度 其他节点更新高度
function updateParentNodeHeight(parentNode, node) {
  let change
  if (parentNode.type == NodeType.CHOICE) {
    change = updateNodeStyleWidthChoice(parentNode)
  } else {
    change = updateNodeStyleHeightExceptChoice(parentNode, node)
  }
  if (parentNode.parentNode) {
    updateParentNodeHeight(findNodeById(parentNode.parentNode))
  }
}
function updateDeleteParentNodeHeight(parentNode, node) {
  let change
  if (parentNode.type == NodeType.CHOICE) {
    change = updateNodeStyleWidthChoice(parentNode)
  } else {
    change = updateNodeStyleHeightExceptChoice(parentNode, node)
    if (
      change != 0 &&
      (parentNode.type == NodeType.CHOICEDEFAULT ||
        parentNode.type == NodeType.CHOICEWHEN)
    ) {
      let newParentNode = findNodeById(parentNode.parentNode)
      updateAddNodeStyleHeightChoice(parentNode, newParentNode, {
        height: change,
      })
    }
  }
  if (parentNode.parentNode) {
    updateDeleteParentNodeHeight(findNodeById(parentNode.parentNode))
  }
}
function updateNodeStyleHeightExceptChoice(parentNode, node) {
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
//CHIOCE新增when节点时新增parentNodePos吸附位置
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
  if (parentNode.parentNode) {
    updateParentNodeHeight(findNodeById(parentNode.parentNode), parentNode)
  }
}
function updateNodeStyleWidthChoice(parentNode) {
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
export {
  dragAdsorption,
  removeNodeAdsorption,
  updateParentNode,
  updateNodePosAddWhenNode,
}
