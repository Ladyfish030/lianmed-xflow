import { computed } from 'vue'
import { useNodeStore } from '@/store/family_tree/nodeStore'

const nodeStore = useNodeStore()

function finalAdjustNode() {
    // 先给所有节点排序
    nodeStore.sortNodesByGenerationAndHorizontalPosition()
    
    nodeStore.nodes.forEach(node => {
        const nextNode = nodeStore.nodes.find((item) => item.data.generation === node.data.generation && item.data.horizontalPosition === node.data.horizontalPosition + 1)
        if (nextNode !== undefined) {
            if (nextNode.position.x - node.position.x < 150) {
                const moveDistance = 150 - (nextNode.position.x - node.position.x)
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
            const startPosition = ((motherNode.position.x - fatherNode.position.x) - 150 * (childrenNumber - 1)) / 2
            for (let i = firstChild.data.horizontalPosition, count = 0; i <= lastChild.data.horizontalPosition; i++, count++){
                const currentNode = nodeStore.nodes.find((item) => item.data.generation === firstChild.data.generation && item.data.horizontalPosition === i)
                currentNode.position = {
                    x: fatherNode.position.x + startPosition + 150 * count,
                    y: currentNode.position.y
                }
            }
        }
    })
}

// 遍历祖辈（上方节点）
function adjustAncestorsPosition(currentNode, moveDistance) {
    if (moveDistance < 75) {
        moveDistance = 75
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

// 遍历子辈（下方节点）
function adjustDescendantsPosition(currentNode, moveDistance) {
    if (!currentNode || currentNode.childrenId.length === 0) return

    if (!nodeStore.isLocatedLeftOfMateNode(currentNode) && currentNode.childrenId.length !== 0) {
        moveDistance = moveDistance / 2
        moveDistance = moveDistance < 75 ? 75 : moveDistance
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

    // finalAdjustNode()
}

function adjustNodesPositionToAddParents(sourceNode) {
    let fatherNode = {}
    let motherNode = {} 
    if (sourceNode.fatherId === '' || sourceNode.motherId === '') return
    else {
        fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        motherNode = nodeStore.findNodeById(sourceNode.motherId)
    }  

    // 如果motherNode的后面一个节点nextNode存在，
    // 且motherNode和nextNode重叠，
    // 则调整nextNode节点这一整个分支的位置
    const nextNode = nodeStore.nodes.find((node) => node.data.generation === motherNode.data.generation && node.data.horizontalPosition === motherNode.data.horizontalPosition + 1)
    if (nextNode !== undefined) {
        if (nextNode.position.x - motherNode.position.x < 150) {
            const moveDistance = 150 - (nextNode.position.x - motherNode.position.x)
            adjustNodesPosition(nextNode, moveDistance)
        }
    }

    // 如果fatherNode的前面一个节点preNode存在，
    // 且fatherNode和preNode重叠，
    // 则调整fatherNode节点这一整个分支的位置
    const preNode = nodeStore.nodes.find((node) => node.data.generation === fatherNode.data.generation && node.data.horizontalPosition === fatherNode.data.horizontalPosition - 1)
    if (preNode !== undefined) {
        if (fatherNode.position.x - preNode.position.x < 150) {
            const moveDistance = 150 - (fatherNode.position.x - preNode.position.x)
            adjustNodesPosition(fatherNode, moveDistance)
        }
    }  

    finalAdjustNode()
}

function adjustNodesPositionToAddBrother(sourceNode) {
    if (!sourceNode) return

    // 遍历node的母亲那一分支的所有节点
    const motherNode = nodeStore.findNodeById(sourceNode.motherId)
    // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + 150)
    motherNode.position = {
        x: motherNode.position.x + 150,
        y: motherNode.position.y
    }
    adjustAncestorsPosition(motherNode, 150)

    // 遍历node和node右边的所有兄弟姐妹
    const nodeIndex = motherNode.childrenId.indexOf(sourceNode.id)
    for (let i = nodeIndex; i < motherNode.childrenId.length; i++) {
        const childNode = nodeStore.findNodeById(motherNode.childrenId[i])
        // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + 150)
        childNode.position = {
            x: childNode.position.x + 150,
            y: childNode.position.y
        }

        adjustDescendantsPosition(childNode, 150)

        // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
        if (childNode.mateId !== '') {
            const mateNode = nodeStore.findNodeById(childNode.mateId)
            // console.log(mateNode.data.generation + ' - ' + mateNode.data.horizontalPosition + ":" + 150)
            mateNode.position = {
                x: mateNode.position.x + 150,
                y: mateNode.position.y
            }
            adjustAncestorsPosition(mateNode, 150)
        }
    }

    finalAdjustNode()
}

function adjustNodesPositionToAddMate() {
    finalAdjustNode()
}

function adjustNodesPositionToAddSon() {
    finalAdjustNode()
}

function deleteNodeAdjustPosition(sourceNode) {
    if (sourceNode.fatherId === '' || sourceNode.motherId === '') return
    const fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
    const motherNode = nodeStore.findNodeById(sourceNode.motherId)
    // if (motherNode.childrenId.length === 1) return

    // 计算所有节点要移动的距离
    let moveDistance = 0
    if (motherNode.childrenId.length === 1) {
        const distance = motherNode.position.x - fatherNode.position.x
        if (distance > 150) moveDistance = distance - 150
        else return
    }
    else {
        if (sourceNode.mateId === '') moveDistance = 150
        else {
            if ((motherNode.childrenId.indexOf(sourceNode.id) !== motherNode.childrenId.length - 1 && nodeStore.isLocatedLeftOfMateNode(sourceNode)) ||
                (motherNode.childrenId.indexOf(sourceNode.id) !== 0 && !nodeStore.isLocatedLeftOfMateNode(sourceNode))) {
                moveDistance = 300
            }
            else moveDistance = 150
        }
    }
    // 移动node的母亲那一分支的所有节点
    // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + moveDistance)
    motherNode.position = {
        x: motherNode.position.x - moveDistance,
        y: motherNode.position.y
    }
    deleteNodeAdjustAncestorsPosition(motherNode, moveDistance)

    // 遍历node右边的所有兄弟姐妹
    const nodeIndex = motherNode.childrenId.indexOf(sourceNode.id)
    for (let i = nodeIndex + 1; i < motherNode.childrenId.length; i++) {
        const childNode = nodeStore.findNodeById(motherNode.childrenId[i])
        // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
        childNode.position = {
            x: childNode.position.x - moveDistance,
            y: childNode.position.y
        }

        deleteNodeAdjustDescendantsPosition(childNode, moveDistance)

        // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
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

    // 遍历祖辈（上方节点）
    function deleteNodeAdjustAncestorsPosition(currentNode, moveDistance) {
        if (moveDistance < 75) {
            moveDistance = 75
        }
        if (!currentNode || (!currentNode.fatherId && !currentNode.motherId)) return

        // 遍历父亲及其祖辈
        if (currentNode.fatherId) {
            const fatherNode = nodeStore.findNodeById(currentNode.fatherId)
            // console.log(fatherNode.data.generation + ' - ' + fatherNode.data.horizontalPosition + ":" + moveDistance)
            fatherNode.position = {
                x: fatherNode.position.x - moveDistance,
                y: fatherNode.position.y
            }
            deleteNodeAdjustAncestorsPosition(fatherNode, moveDistance)
        }

        // 遍历母亲及其祖辈
        if (currentNode.motherId) {
            const motherNode = nodeStore.findNodeById(currentNode.motherId)
            // console.log(motherNode.data.generation + ' - ' + motherNode.data.horizontalPosition + ":" + moveDistance)
            motherNode.position = {
                x: motherNode.position.x - moveDistance,
                y: motherNode.position.y
            }
            deleteNodeAdjustAncestorsPosition(motherNode, moveDistance)
        }

        //如果该节点的父母有其他子女，则遍历该节点的父母的所有子女及其子辈
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

                    // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
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

    // 遍历子辈（下方节点）
    function deleteNodeAdjustDescendantsPosition(currentNode, moveDistance) {
        if (!currentNode || currentNode.childrenId.length === 0) return

        if (!nodeStore.isLocatedLeftOfMateNode(currentNode) && currentNode.childrenId.length !== 0) {
            moveDistance = moveDistance / 2
            moveDistance = moveDistance < 75 ? 75 : moveDistance
        }

        currentNode.childrenId.forEach(childId => {
            const childNode = nodeStore.findNodeById(childId)
            // console.log(childNode.data.generation + ' - ' + childNode.data.horizontalPosition + ":" + moveDistance)
            childNode.position = {
                x: childNode.position.x - moveDistance,
                y: childNode.position.y
            }
            deleteNodeAdjustDescendantsPosition(childNode, moveDistance)

            // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
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