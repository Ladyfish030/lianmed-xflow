import { computed } from 'vue'
import { useNodeStore } from '@/store/family_tree/nodeStore'
import { NodeAdjustPositionConstantEnum } from '@/enums/family_tree/NodeAdjustPositionConstantEnum'

const nodeStore = useNodeStore()

/**
 * 对所有节点进行最终位置调整，保证节点间距和居中
 */
function finalAdjustNode() {
    // 先给所有节点排序
    nodeStore.sortNodesByGenerationAndHorizontalPosition()
    
    // 调整同一代相邻节点的水平间距
    nodeStore.nodes.forEach(node => {
        const nextNode = nodeStore.nodes.find((item) => item.data.generation === node.data.generation && item.data.horizontalPosition === node.data.horizontalPosition + 1)
        if (nextNode !== undefined) {
            if (nextNode.position.x - node.position.x < NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP) {
                const moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP - (nextNode.position.x - node.position.x)
                adjustNodesPosition(nextNode, moveDistance)
            }
        }
    })

    // 遍历所有节点，如果该节点存在孩子节点，且孩子位置没有居中，则调整该节点的位置
    nodeStore.nodes.forEach(node => {
        if (node.childrenId.length !== 0 && nodeStore.isLocatedLeftOfMateNode(node)) {
            const fatherNode = node
            const motherNode = nodeStore.findNodeById(node.mateId)
            const firstChild = nodeStore.findNodeById(fatherNode.childrenId[0])
            const lastChild = nodeStore.findNodeById(fatherNode.childrenId[fatherNode.childrenId.length - 1])
            const childrenNumber = lastChild.data.horizontalPosition - firstChild.data.horizontalPosition + 1
            const startPosition = ((motherNode.position.x - fatherNode.position.x) - NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP * (childrenNumber - 1)) / 2
            for (let i = firstChild.data.horizontalPosition, count = 0; i <= lastChild.data.horizontalPosition; i++, count++){
                const currentNode = nodeStore.nodes.find((item) => item.data.generation === firstChild.data.generation && item.data.horizontalPosition === i)
                currentNode.position = {
                    x: fatherNode.position.x + startPosition + NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP * count,
                    y: currentNode.position.y
                }
            }
        }
    })
}

/**
 * 递归调整祖辈（上方节点）及其分支的位置
 */
function adjustAncestorsPosition(currentNode, moveDistance) {
    if (moveDistance < NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE) {
        moveDistance = NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE
    }
    if (!currentNode || (!currentNode.fatherId && !currentNode.motherId)) return
    
    // 遍历父亲及其祖辈
    if (currentNode.fatherId) {
        const fatherNode = nodeStore.findNodeById(currentNode.fatherId)
        // console.log(fatherNode.data.generation + ' - ' + fatherNode.data.horizontalPosition + ":" + moveDistance)
        fatherNode.position = {
            x: fatherNode.position.x + moveDistance,
            y: fatherNode.position.y
        }
        adjustAncestorsPosition(fatherNode, moveDistance)
    }

    // 遍历母亲及其祖辈
    if (currentNode.motherId) {
        const motherNode = nodeStore.findNodeById(currentNode.motherId)
        // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + moveDistance)
        motherNode.position = {
            x: motherNode.position.x + moveDistance,
            y: motherNode.position.y
        }
        adjustAncestorsPosition(motherNode, moveDistance)
    }

    //如果该节点的父母有其他子女，则遍历该节点的父母的所有子女及其子辈
    if (currentNode.fatherId && currentNode.motherId) {
        const motherNode = nodeStore.findNodeById(currentNode.motherId)
        motherNode.childrenId.forEach(childId => { 
            if (childId !== currentNode.id) {
                const childNode = nodeStore.findNodeById(childId)
                // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
                childNode.position = {
                    x: childNode.position.x + moveDistance,
                    y: childNode.position.y
                }
                adjustDescendantsPosition(childNode, moveDistance)

                // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
                if (childNode.mateId !== '') {
                    const mateNode = nodeStore.findNodeById(childNode.mateId)
                    // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + moveDistance)
                    mateNode.position = {
                        x: mateNode.position.x + moveDistance,
                        y: mateNode.position.y
                    }
                    adjustAncestorsPosition(mateNode, moveDistance)
                }
            }
        })
    }
}

/**
 * 递归调整子辈（下方节点）及其分支的位置
 */
function adjustDescendantsPosition(currentNode, moveDistance) {
    if (!currentNode || currentNode.childrenId.length === 0) return

    // 若不是配偶左侧节点，且有子女，移动距离减半但不小于最小移动距离
    if (!nodeStore.isLocatedLeftOfMateNode(currentNode) && currentNode.childrenId.length !== 0) {
        moveDistance = moveDistance / 2
        moveDistance = moveDistance < NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE ? NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE : moveDistance
    }

    currentNode.childrenId.forEach(childId => {
        const childNode = nodeStore.findNodeById(childId)
        // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
        childNode.position = {
            x: childNode.position.x + moveDistance,
            y: childNode.position.y
        }
        adjustDescendantsPosition(childNode, moveDistance)

        // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
        if (childNode.mateId !== '') {
            if (!(currentNode.childrenId[0] === childNode.id && !nodeStore.isLocatedLeftOfMateNode(childNode))) {
                const mateNode = nodeStore.findNodeById(childNode.mateId)
                // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + moveDistance)
                mateNode.position = {
                    x: mateNode.position.x + moveDistance,
                    y: mateNode.position.y
                }
                adjustAncestorsPosition(mateNode, moveDistance)
            }
        }
    });
}

/**
 * 调整单个节点及其祖辈、子辈、配偶分支的位置
 */
function adjustNodesPosition(node, moveDistance) {
    if (!node) return
    else {
        // console.log(node.data.generation + ' - ' + node.data.horizontalPosition + ":" + moveDistance)
        node.position = {
            x: node.position.x + moveDistance,
            y: node.position.y
        }
    }

    // 遍历当前节点的祖辈和子辈
    adjustAncestorsPosition(node, moveDistance)
    adjustDescendantsPosition(node, moveDistance)

    // 判断该节点是否是父母节点的左边，如果是左边的节点，则还需要遍历配偶的祖辈
    if (nodeStore.isLocatedLeftOfMateNode(node)) {
        const mateNode = nodeStore.findNodeById(node.mateId)
        // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + 150)
        mateNode.position = {
            x: mateNode.position.x + moveDistance,
            y: mateNode.position.y
        }
        adjustAncestorsPosition(mateNode, moveDistance)
    }

}

/**
 * 新增父母节点时的整体位置调整
 */
function adjustNodesPositionToAddParents(sourceNode) {
    let fatherNode = {}
    let motherNode = {} 
    if (sourceNode.fatherId === '' || sourceNode.motherId === '') return
    else {
        fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        motherNode = nodeStore.findNodeById(sourceNode.motherId)
    }  

    // 检查母亲节点右侧是否重叠，若重叠则整体右移
    const nextNode = nodeStore.nodes.find((node) => node.data.generation === motherNode.data.generation && node.data.horizontalPosition === motherNode.data.horizontalPosition + 1)
    if (nextNode !== undefined) {
        if (nextNode.position.x - motherNode.position.x < NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP) {
            const moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP - (nextNode.position.x - motherNode.position.x)
            adjustNodesPosition(nextNode, moveDistance)
        }
    }

    // 检查父亲节点左侧是否重叠，若重叠则整体左移
    const preNode = nodeStore.nodes.find((node) => node.data.generation === fatherNode.data.generation && node.data.horizontalPosition === fatherNode.data.horizontalPosition - 1)
    if (preNode !== undefined) {
        if (fatherNode.position.x - preNode.position.x < NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP) {
            const moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP - (fatherNode.position.x - preNode.position.x)
            adjustNodesPosition(fatherNode, moveDistance)
        }
    }  

    finalAdjustNode()
}

/**
 * 新增兄弟节点时的整体位置调整
 */
function adjustNodesPositionToAddBrother(sourceNode) {
    if (!sourceNode) return

    // 母亲分支整体右移
    const motherNode = nodeStore.findNodeById(sourceNode.motherId)
    // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + 150)
    motherNode.position = {
        x: motherNode.position.x + NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP,
        y: motherNode.position.y
    }
    adjustAncestorsPosition(motherNode, NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP)

    // 右侧兄弟姐妹及其后代整体右移
    const nodeIndex = motherNode.childrenId.indexOf(sourceNode.id)
    for (let i = nodeIndex; i < motherNode.childrenId.length; i++) {
        const childNode = nodeStore.findNodeById(motherNode.childrenId[i])
        // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + 150)
        childNode.position = {
            x: childNode.position.x + NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP,
            y: childNode.position.y
        }

        adjustDescendantsPosition(childNode, NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP)

        // 若有配偶，也递归调整配偶的祖辈
        if (childNode.mateId !== '') {
            const mateNode = nodeStore.findNodeById(childNode.mateId)
            // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + 150)
            mateNode.position = {
                x: mateNode.position.x + NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP,
                y: mateNode.position.y
            }
            adjustAncestorsPosition(mateNode, NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP)
        }
    }

    finalAdjustNode()
}

/**
 * 新增配偶节点时的整体位置调整
 */
function adjustNodesPositionToAddMate() {
    finalAdjustNode()
}

/**
 * 新增子节点时的整体位置调整
 */
function adjustNodesPositionToAddSon() {
    finalAdjustNode()
}

/**
 * 删除节点时的整体位置调整
 */
function deleteNodeAdjustPosition(sourceNode) {
    if (sourceNode.fatherId === '' || sourceNode.motherId === '') return
    const fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
    const motherNode = nodeStore.findNodeById(sourceNode.motherId)
    // if (motherNode.childrenId.length === 1) return

    // 计算所有节点要移动的距离
    let moveDistance = 0
    if (motherNode.childrenId.length === 1) {
        const distance = motherNode.position.x - fatherNode.position.x
        if (distance > NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP) moveDistance = distance - NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP
        else return
    }
    else {
        if (sourceNode.mateId === '') moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP
        else {
            // 若删除的不是两端节点且有配偶，移动距离为两倍间距
            if ((motherNode.childrenId.indexOf(sourceNode.id) !== motherNode.childrenId.length - 1 && nodeStore.isLocatedLeftOfMateNode(sourceNode)) ||
                (motherNode.childrenId.indexOf(sourceNode.id) !== 0 && !nodeStore.isLocatedLeftOfMateNode(sourceNode))) {
                moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP * 2
            }
            else moveDistance = NodeAdjustPositionConstantEnum.MIN_HORIZONTAL_GAP
        }
    }
    // 母亲分支整体左移
    // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + moveDistance)
    motherNode.position = {
        x: motherNode.position.x - moveDistance,
        y: motherNode.position.y
    }
    deleteNodeAdjustAncestorsPosition(motherNode, moveDistance)

    // 右侧兄弟姐妹及其后代整体左移
    const nodeIndex = motherNode.childrenId.indexOf(sourceNode.id)
    for (let i = nodeIndex + 1; i < motherNode.childrenId.length; i++) {
        const childNode = nodeStore.findNodeById(motherNode.childrenId[i])
        // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
        childNode.position = {
            x: childNode.position.x - moveDistance,
            y: childNode.position.y
        }

        deleteNodeAdjustDescendantsPosition(childNode, moveDistance)

        // 若有配偶，也递归调整配偶的祖辈
        if (childNode.mateId !== '') {
            const mateNode = nodeStore.findNodeById(childNode.mateId)
            // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + moveDistance)
            mateNode.position = {
                x: mateNode.position.x - moveDistance,
                y: mateNode.position.y
            }
            deleteNodeAdjustAncestorsPosition(mateNode, moveDistance)
        }
    }

    // 递归调整祖辈（上方节点）及其分支的位置
    function deleteNodeAdjustAncestorsPosition(currentNode, moveDistance) {
        if (moveDistance < NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE) {
            moveDistance = NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE
        }
        if (!currentNode || (!currentNode.fatherId && !currentNode.motherId)) return

        // 调整父亲及其祖辈
        if (currentNode.fatherId) {
            const fatherNode = nodeStore.findNodeById(currentNode.fatherId)
            // console.log(fatherNode.data.generation + ' - ' + fatherNode.data.horizontalPosition + ":" + moveDistance)
            fatherNode.position = {
                x: fatherNode.position.x - moveDistance,
                y: fatherNode.position.y
            }
            deleteNodeAdjustAncestorsPosition(fatherNode, moveDistance)
        }

        // 调整母亲及其祖辈
        if (currentNode.motherId) {
            const motherNode = nodeStore.findNodeById(currentNode.motherId)
            // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + moveDistance)
            motherNode.position = {
                x: motherNode.position.x - moveDistance,
                y: motherNode.position.y
            }
            deleteNodeAdjustAncestorsPosition(motherNode, moveDistance)
        }

        // 如果父母有其他子女，也要递归调整这些子女及其后代
        if (currentNode.fatherId && currentNode.motherId) {
            const motherNode = nodeStore.findNodeById(currentNode.motherId)
            motherNode.childrenId.forEach(childId => {
                if (childId !== currentNode.id) {
                    const childNode = nodeStore.findNodeById(childId)
                    // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
                    childNode.position = {
                        x: childNode.position.x - moveDistance,
                        y: childNode.position.y
                    }
                    deleteNodeAdjustDescendantsPosition(childNode, moveDistance)

                    // 若有配偶，也递归调整配偶的祖辈
                    if (childNode.mateId !== '') {
                        const mateNode = nodeStore.findNodeById(childNode.mateId)
                        // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + moveDistance)
                        mateNode.position = {
                            x: mateNode.position.x + moveDistance,
                            y: mateNode.position.y
                        }
                        deleteNodeAdjustAncestorsPosition(mateNode, moveDistance)
                    }
                }
            })
        }
    }

    // 递归调整子辈（下方节点）及其分支的位置
    function deleteNodeAdjustDescendantsPosition(currentNode, moveDistance) {
        if (!currentNode || currentNode.childrenId.length === 0) return

        if (!nodeStore.isLocatedLeftOfMateNode(currentNode) && currentNode.childrenId.length !== 0) {
            moveDistance = moveDistance / 2
            moveDistance = moveDistance < NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE ? NodeAdjustPositionConstantEnum.MIN_MOVE_DISTANCE : moveDistance
        }

        currentNode.childrenId.forEach(childId => {
            const childNode = nodeStore.findNodeById(childId)
            // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
            childNode.position = {
                x: childNode.position.x - moveDistance,
                y: childNode.position.y
            }
            deleteNodeAdjustDescendantsPosition(childNode, moveDistance)

            // 若有配偶，也递归调整配偶的祖辈
            if (childNode.mateId !== '') {
                if (!(currentNode.childrenId[0] === childNode.id && !nodeStore.isLocatedLeftOfMateNode(childNode))) {
                    const mateNode = nodeStore.findNodeById(childNode.mateId)
                    // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + moveDistance)
                    mateNode.position = {
                        x: mateNode.position.x - moveDistance,
                        y: mateNode.position.y
                    }
                    deleteNodeAdjustAncestorsPosition(mateNode, moveDistance)
                }
            }
        });
    }
}

export {
    adjustNodesPosition,
    adjustNodesPositionToAddParents,
    adjustNodesPositionToAddMate,
    adjustNodesPositionToAddBrother,
    adjustNodesPositionToAddSon,
    deleteNodeAdjustPosition,
}