import { NodeType } from '../enums/NodeType'
import { ref, reactive } from 'vue'
import { findNodeById } from './useNode'
let parentNodePosition = []
//当拉动一个节点时需要判断是否需要吸附
function dragAdsorption(node) {
  for (let i = parentNodePosition.length - 1; i >= 0; i--) {
    let item = parentNodePosition[i]
    if (
      node.position.x >= item.xMin &&
      node.position.x <= item.xMax &&
      node.position.y >= item.yMin &&
      node.position.y <= item.yMax &&
      node.id != item.id &&
      node.parentNode != item.id
    ) {
      let parentNode = findNodeById(item.id)
      getLastPos(node, parentNode) //放置新节点的位置
      node.draggable = false
      node.parentNode = item.id
      parentNode.childNodes.push(node.id)
      //更新父节点的大小
      updateAddNodeStyleExceptChoice(node, parentNode)
      updateNodeStyleHeightExceptChoice(parentNode, node)
      updateParentNode(parentNode) //更新祖上节点的parentNodePos和位置
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
    if (parseInt(node.style.height) + 50 < parseInt(parentNode.style.height)) {
      updateNodeStyleHeightExceptChoice(parentNode)
    }
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
        break
      }
    }
  }
}
//更新可吸附的parentNodePosition
function updateParentNode(node) {
  //只更新新增节点版本
  if (node.adsorption) {
    let { x, y } = getTruePos(node)
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
//由于子节点的position是相对父节点的，该函数可以拿到子节点争取的position
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
    changeStyle = {}
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
    parentNode.style.height =
      parseInt(parentNode.style.height) < parseInt(node.style.height) + 50
        ? parseInt(node.style.height) + 50 + 'px'
        : parentNode.style.height
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
//删除节点更新宽度
function updateDeleteNodeStyleWidthExceptChoice(node, parentNode, width) {
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
//节点更新高度
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
  parentNode.style.height =
    maxHeight < parentNode.initDimensions.height
      ? parentNode.initDimensions.height + 'px'
      : maxHeight + 'px'
  if (parentNode.parentNode) {
    updateNodeStyleHeightExceptChoice(findNodeById(parentNode.parentNode))
  }
}
export { dragAdsorption, removeNodeAdsorption, updateParentNode }
