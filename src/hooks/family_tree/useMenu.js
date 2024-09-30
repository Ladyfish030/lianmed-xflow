import { ref } from 'vue'

import { useNodeStore } from '@/store/family_tree/nodeStore'

import { addEdge } from './useEdge'
import {
    adjustNodesPositionToAddParents,
    adjustNodesPositionToAddMate,
    adjustNodesPositionToAddBrother,
    adjustNodesPositionToAddSon,
    deleteNodeAdjustPosition
} from './useAdjustPosition'
import { nodeInformationDrawerVisible, drawerClickNode} from './useDrawer'

const nodeStore = useNodeStore()

const nodeMenuVisible = ref(false)
const menuClickNode = ref(null)
const menuPosition = ref({ x: 0, y: 0 })

function onNodeContextMenu(e) {
    menuClickNode.value = e.node
    menuPosition.value = {
        x: e.event.layerX,
        y: e.event.layerY,
    }
    nodeMenuVisible.value = true
}

function addParentsNode(sourceNode) {
    // 修改所有节点位于家系图中的代数
    if (sourceNode.data.generation === 1) {
        const generationFlag = sourceNode.data.generation
        nodeStore.nodes.forEach((node) => {
            if (node.data.generation >= generationFlag) {
                node.data.generation = node.data.generation + 1
            }
        })
    }
    
    // 初始化父亲、母亲节点
    var fatherNode = nodeStore.initNode()
    var motherNode = nodeStore.initNode()

    // 修改父亲的horizontalPosition属性
    const lastElderInFrontNode = nodeStore.findLastElderInFront(sourceNode)
    if (lastElderInFrontNode === null) {
        fatherNode.data.horizontalPosition = 1
    }
    else {
        fatherNode.data.horizontalPosition = lastElderInFrontNode.data.horizontalPosition + 1
    }

    fatherNode.data.sex = 1
    fatherNode.data.generation = sourceNode.data.generation - 1
    fatherNode.mateId = motherNode.id
    fatherNode.childrenId.push(sourceNode.id)
    fatherNode.position = {
        x: sourceNode.position.x - 75,
        y: sourceNode.position.y - 120
    }

    motherNode.data.sex = 0
    motherNode.data.generation = sourceNode.data.generation - 1
    motherNode.data.horizontalPosition = fatherNode.data.horizontalPosition + 1
    motherNode.mateId = fatherNode.id
    motherNode.childrenId.push(sourceNode.id)
    motherNode.position = {
        x: sourceNode.position.x + 75,
        y: sourceNode.position.y - 120
    }

    nodeStore.addNode(fatherNode)
    nodeStore.addNode(motherNode)

    // 修改与父亲、母亲同一代的后面节点的horizontalPosition属性
    nodeStore.nodes.forEach(node => {
        if (node.data.generation === fatherNode.data.generation &&
            node.data.horizontalPosition >= fatherNode.data.horizontalPosition &&
            node.id !== fatherNode.id && 
            node.id !== motherNode.id
        ) {
            node.data.horizontalPosition = node.data.horizontalPosition + 2
        }
    })

    // 修改孩子节点的父母
    sourceNode.fatherId = fatherNode.id
    sourceNode.motherId = motherNode.id

    // 添加父母和孩子的连线
    let source = fatherNode.id
    let target = motherNode.id
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'
    addEdge(source, target, sourceHandle, targetHandle)

    source = fatherNode.id
    target = sourceNode.id
    sourceHandle = 'source-right'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    source = motherNode.id
    target = sourceNode.id
    sourceHandle = 'source-left'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    adjustNodesPositionToAddParents(sourceNode)

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = fatherNode
}

function addMateNode(sourceNode) {
    var mateNode = nodeStore.initNode()
    mateNode.data.sex = sourceNode.data.sex === 2 ? 2 : (sourceNode.data.sex === 0 ? 1 : 0)
    mateNode.mateId = sourceNode.id
    sourceNode.mateId = mateNode.id

    let source = ''
    let target = ''
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'
    if (sourceNode.data.sex === 0) {
        mateNode.data.generation = sourceNode.data.generation
        mateNode.data.horizontalPosition = sourceNode.data.horizontalPosition

        // 修改与mateNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === mateNode.data.generation &&
                node.data.horizontalPosition >= mateNode.data.horizontalPosition &&
                node.id !== mateNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        // 确定mateNode的位置
        if (sourceNode.fatherId !== '') {
            const fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
            // 如果该节点在兄弟姐妹第一位
            if (sourceNode.id === fatherNode.childrenId[0]) {
                mateNode.position = {
                    x: sourceNode.position.x - 150,
                    y: sourceNode.position.y
                }
                nodeStore.addNode(mateNode)

                adjustNodesPositionToAddMate()
            }
            else {
                mateNode.position = {
                    x: sourceNode.position.x - 150,
                    y: sourceNode.position.y
                }
                nodeStore.addNode(mateNode)

                // 调整sourceNode和右边兄弟姐妹及其分支的位置
                adjustNodesPositionToAddBrother(sourceNode)
            }
        }
        else {
            mateNode.position = {
                x: sourceNode.position.x - 150,
                y: sourceNode.position.y
            }
            nodeStore.addNode(mateNode)
            adjustNodesPositionToAddMate()
        }

        source = mateNode.id
        target = sourceNode.id
        addEdge(source, target, sourceHandle, targetHandle)
    }
    else {
        mateNode.data.generation = sourceNode.data.generation
        mateNode.data.horizontalPosition = sourceNode.data.horizontalPosition + 1

        // 修改与mateNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === sourceNode.data.generation &&
                node.data.horizontalPosition > sourceNode.data.horizontalPosition &&
                node.id !== mateNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        // 计算mateNode的位置
        if (sourceNode.motherId !== '') {
            const motherNode = nodeStore.findNodeById(sourceNode.motherId)
            // 如果该节点在兄弟姐妹最后一位
            if (sourceNode.id === motherNode.childrenId[motherNode.childrenId.length - 1]) {
                mateNode.position = {
                    x: sourceNode.position.x + 150,
                    y: sourceNode.position.y
                }
                nodeStore.addNode(mateNode)

                adjustNodesPositionToAddMate()
            }
            else {
                mateNode.position = {
                    x: sourceNode.position.x + 150,
                    y: sourceNode.position.y
                }
                nodeStore.addNode(mateNode)

                // 调整sourceNode的右边兄弟姐妹及其分支的位置
                const nextNode = nodeStore.findNodeById(motherNode.childrenId[motherNode.childrenId.indexOf(sourceNode.id) + 1])
                adjustNodesPositionToAddBrother(nextNode)
            }
        }
        else {
            mateNode.position = {
                x: sourceNode.position.x + 150,
                y: sourceNode.position.y
            }
            nodeStore.addNode(mateNode)
            adjustNodesPositionToAddMate()
        }

        source = sourceNode.id
        target = mateNode.id
        addEdge(source, target, sourceHandle, targetHandle)
    }

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = mateNode
}

function addBrotherNode(sourceNode) {
    // 如果该节点没有父母节点，则新增父母节点
    if (sourceNode.fatherId === '' && sourceNode.motherId === '') {
        addParentsNode(sourceNode)
    }

    let brotherNode = nodeStore.initNode()
    brotherNode.data.sex = 1
    brotherNode.data.generation = sourceNode.data.generation
    brotherNode.fatherId = sourceNode.fatherId
    brotherNode.motherId = sourceNode.motherId

    if (nodeStore.isLocatedLeftOfMateNode(sourceNode)) {
        // 调整兄弟姐妹顺序
        let fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        let motherNode = nodeStore.findNodeById(sourceNode.motherId)
        const sourceIndex = motherNode.childrenId.indexOf(sourceNode.id)
        fatherNode.childrenId.splice(sourceIndex, 0, brotherNode.id)
        motherNode.childrenId.splice(sourceIndex, 0, brotherNode.id)

        // 计算brotherNode的horizontalPosition属性
        brotherNode.data.horizontalPosition = sourceNode.data.horizontalPosition

        // 计算brotherNode的位置
        brotherNode.position = {
            x: sourceNode.position.x,
            y: sourceNode.position.y
        }

        // 修改与brotherNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === brotherNode.data.generation &&
                node.data.horizontalPosition >= brotherNode.data.horizontalPosition &&
                node.id !== brotherNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(brotherNode)

        // 调整sourceNode及其分支的位置
        adjustNodesPositionToAddBrother(sourceNode)
    }
    else {
        // 调整兄弟姐妹顺序
        let fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        let motherNode = nodeStore.findNodeById(sourceNode.motherId)
        const sourceIndex = motherNode.childrenId.indexOf(sourceNode.id)
        fatherNode.childrenId.splice(sourceIndex + 1, 0, brotherNode.id)
        motherNode.childrenId.splice(sourceIndex + 1, 0, brotherNode.id)

        // 计算brotherNode的horizontalPosition属性
        brotherNode.data.horizontalPosition = sourceNode.data.horizontalPosition + 1

        // 计算brotherNode的位置
        brotherNode.position = {
            x: sourceNode.position.x,
            y: sourceNode.position.y
        }

        // 修改与brotherNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === brotherNode.data.generation &&
                node.data.horizontalPosition >= brotherNode.data.horizontalPosition &&
                node.id !== brotherNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(brotherNode)

        // 调整sourceNode及其分支的位置
        adjustNodesPositionToAddBrother(brotherNode)
    }

    // 添加父母和brotherNode的连线
    let source = ''
    let target = ''
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'

    source = brotherNode.fatherId
    target = brotherNode.id
    sourceHandle = 'source-right'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    source = brotherNode.motherId
    target = brotherNode.id
    sourceHandle = 'source-left'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = brotherNode
}

function addSisterNode(sourceNode) {
    // 如果该节点没有父母节点，则新增父母节点
    if (sourceNode.fatherId === '' && sourceNode.motherId === '') {
        addParentsNode(sourceNode)
    }

    let sisterNode = nodeStore.initNode()
    sisterNode.data.sex = 0
    sisterNode.data.generation = sourceNode.data.generation
    sisterNode.fatherId = sourceNode.fatherId
    sisterNode.motherId = sourceNode.motherId

    if (nodeStore.isLocatedLeftOfMateNode(sourceNode)) {
        // 调整兄弟姐妹顺序
        let fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        let motherNode = nodeStore.findNodeById(sourceNode.motherId)
        const sourceIndex = motherNode.childrenId.indexOf(sourceNode.id)
        fatherNode.childrenId.splice(sourceIndex, 0, sisterNode.id)
        motherNode.childrenId.splice(sourceIndex, 0, sisterNode.id)

        // 计算brotherNode的horizontalPosition属性
        sisterNode.data.horizontalPosition = sourceNode.data.horizontalPosition

        // 计算brotherNode的位置
        sisterNode.position = {
            x: sourceNode.position.x,
            y: sourceNode.position.y
        }

        // 修改与brotherNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === sisterNode.data.generation &&
                node.data.horizontalPosition >= sisterNode.data.horizontalPosition &&
                node.id !== sisterNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(sisterNode)

        // 调整sourceNode及其分支的位置
        adjustNodesPositionToAddBrother(sourceNode)
    }
    else {
        // 调整兄弟姐妹顺序
        let fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        let motherNode = nodeStore.findNodeById(sourceNode.motherId)
        const sourceIndex = motherNode.childrenId.indexOf(sourceNode.id)
        fatherNode.childrenId.splice(sourceIndex + 1, 0, sisterNode.id)
        motherNode.childrenId.splice(sourceIndex + 1, 0, sisterNode.id)

        // 计算brotherNode的horizontalPosition属性
        sisterNode.data.horizontalPosition = sourceNode.data.horizontalPosition + 1

        // 计算brotherNode的位置
        sisterNode.position = {
            x: sourceNode.position.x,
            y: sourceNode.position.y
        }

        // 修改与brotherNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === sisterNode.data.generation &&
                node.data.horizontalPosition >= sisterNode.data.horizontalPosition &&
                node.id !== sisterNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(sisterNode)

        // 调整sourceNode及其分支的位置
        adjustNodesPositionToAddBrother(sisterNode)
    }

    // 添加父母和brotherNode的连线
    let source = ''
    let target = ''
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'

    source = sisterNode.fatherId
    target = sisterNode.id
    sourceHandle = 'source-right'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    source = sisterNode.motherId
    target = sisterNode.id
    sourceHandle = 'source-left'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = sisterNode
}

function addSonNode(sourceNode) {
    // 如果该节点没有配偶节点，则新增配偶节点
    if (sourceNode.mateId === '') {
        addMateNode(sourceNode)
    }

    let sonNode = nodeStore.initNode()
    sonNode.data.sex = 1
    sonNode.data.generation = sourceNode.data.generation + 1

    // 确定sonNode的父亲、母亲节点
    let mateNode = nodeStore.findNodeById(sourceNode.mateId)
    let fatherNode = {}
    let motherNode = {}
    if (nodeStore.isLocatedLeftOfMateNode(mateNode)) {
        fatherNode = mateNode
        motherNode = sourceNode
        
    }
    else {
        fatherNode = sourceNode
        motherNode = mateNode
    }
    sonNode.fatherId = fatherNode.id
    sonNode.motherId = motherNode.id

    if (fatherNode.childrenId.length === 0) {
        fatherNode.childrenId.push(sonNode.id)
        motherNode.childrenId.push(sonNode.id)

        // 计算sonNode的位置
        sonNode.position = {
            x: fatherNode.position.x + (motherNode.position.x - fatherNode.position.x) / 2,
            y: fatherNode.position.y + 120
        }

        // 计算sonNode的horizontalPosition属性
        let preNode = nodeStore.nodes.find((node) => node.data.generation === fatherNode.data.generation && node.data.horizontalPosition === fatherNode.data.horizontalPosition - 1)
        while (preNode !== undefined && preNode.childrenId.length === 0) {
            preNode = nodeStore.nodes.find((node) => node.data.generation === preNode.data.generation && node.data.horizontalPosition === preNode.data.horizontalPosition - 1)
        }
        if (preNode === undefined) {
            sonNode.data.horizontalPosition = 1
        }
        else {
            let lastChildNode = nodeStore.findNodeById(preNode.childrenId[preNode.childrenId.length - 1])
            if (lastChildNode.mateId !== '' && nodeStore.isLocatedLeftOfMateNode(lastChildNode)) {
                lastChildNode = nodeStore.findNodeById(lastChildNode.mateId)
            }
            sonNode.data.horizontalPosition = lastChildNode.data.horizontalPosition + 1
        }
        // 修改与sonNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === sonNode.data.generation &&
                node.data.horizontalPosition >= sonNode.data.horizontalPosition &&
                node.id !== sonNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(sonNode)

        adjustNodesPositionToAddSon()
    }
    else {
        let lastChildNode = nodeStore.findNodeById(fatherNode.childrenId[fatherNode.childrenId.length - 1])
        if (!nodeStore.isLocatedLeftOfMateNode(lastChildNode)) {
            fatherNode.childrenId.push(sonNode.id)
            motherNode.childrenId.push(sonNode.id)

            // 计算sonNode的位置
            sonNode.position = {
                x: lastChildNode.position.x,
                y: lastChildNode.position.y
            }

            // 计算sonNode的horizontalPosition属性
            sonNode.data.horizontalPosition = lastChildNode.data.horizontalPosition + 1

            // 修改与sonNode同一代的后面节点的horizontalPosition属性
            nodeStore.nodes.forEach(node => {
                if (node.data.generation === sonNode.data.generation &&
                    node.data.horizontalPosition >= sonNode.data.horizontalPosition &&
                    node.id !== sonNode.id
                ) {
                    node.data.horizontalPosition = node.data.horizontalPosition + 1
                }
            })

            nodeStore.addNode(sonNode)

            adjustNodesPositionToAddBrother(sonNode)
        }
        else {
            fatherNode.childrenId.splice(fatherNode.childrenId.length - 1, 0, sonNode.id)
            motherNode.childrenId.splice(motherNode.childrenId.length - 1, 0, sonNode.id)

            // 计算sonNode的位置
            sonNode.position = {
                x: lastChildNode.position.x,
                y: lastChildNode.position.y
            }

            // 计算sonNode的horizontalPosition属性
            sonNode.data.horizontalPosition = lastChildNode.data.horizontalPosition

            // 修改与sonNode同一代的后面节点的horizontalPosition属性
            nodeStore.nodes.forEach(node => {
                if (node.data.generation === sonNode.data.generation &&
                    node.data.horizontalPosition >= sonNode.data.horizontalPosition &&
                    node.id !== sonNode.id
                ) {
                    node.data.horizontalPosition = node.data.horizontalPosition + 1
                }
            })

            nodeStore.addNode(sonNode)

            adjustNodesPositionToAddBrother(lastChildNode)
        }
    }

    // 添加父母和sonNode的连线
    let source = ''
    let target = ''
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'

    source = sonNode.fatherId
    target = sonNode.id
    sourceHandle = 'source-right'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    source = sonNode.motherId
    target = sonNode.id
    sourceHandle = 'source-left'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = sonNode
}

function addDaughterNode(sourceNode) {
    // 如果该节点没有配偶节点，则新增配偶节点
    if (sourceNode.mateId === '') {
        addMateNode(sourceNode)
    }

    let daughterNode = nodeStore.initNode()
    daughterNode.data.sex = 0
    daughterNode.data.generation = sourceNode.data.generation + 1

    // 确定sonNode的父亲、母亲节点
    let mateNode = nodeStore.findNodeById(sourceNode.mateId)
    let fatherNode = {}
    let motherNode = {}
    if (nodeStore.isLocatedLeftOfMateNode(mateNode)) {
        fatherNode = mateNode
        motherNode = sourceNode
        
    }
    else {
        fatherNode = sourceNode
        motherNode = mateNode
    }
    daughterNode.fatherId = fatherNode.id
    daughterNode.motherId = motherNode.id

    if (fatherNode.childrenId.length === 0) {
        fatherNode.childrenId.push(daughterNode.id)
        motherNode.childrenId.push(daughterNode.id)

        // 计算sonNode的位置
        daughterNode.position = {
            x: fatherNode.position.x + (motherNode.position.x - fatherNode.position.x) / 2,
            y: fatherNode.position.y + 120
        }

        // 计算sonNode的horizontalPosition属性
        let preNode = nodeStore.nodes.find((node) => node.data.generation === fatherNode.data.generation && node.data.horizontalPosition === fatherNode.data.horizontalPosition - 1)
        while (preNode !== undefined && preNode.childrenId.length === 0) {
            preNode = nodeStore.nodes.find((node) => node.data.generation === preNode.data.generation && node.data.horizontalPosition === preNode.data.horizontalPosition - 1)
        }
        if (preNode === undefined) {
            daughterNode.data.horizontalPosition = 1
        }
        else {
            let lastChildNode = nodeStore.findNodeById(preNode.childrenId[preNode.childrenId.length - 1])
            if (lastChildNode.mateId !== '' && nodeStore.isLocatedLeftOfMateNode(lastChildNode)) {
                lastChildNode = nodeStore.findNodeById(lastChildNode.mateId)
            }
            daughterNode.data.horizontalPosition = lastChildNode.data.horizontalPosition + 1
        }
        // 修改与sonNode同一代的后面节点的horizontalPosition属性
        nodeStore.nodes.forEach(node => {
            if (node.data.generation === daughterNode.data.generation &&
                node.data.horizontalPosition >= daughterNode.data.horizontalPosition &&
                node.id !== daughterNode.id
            ) {
                node.data.horizontalPosition = node.data.horizontalPosition + 1
            }
        })

        nodeStore.addNode(daughterNode)

        adjustNodesPositionToAddSon()
    }
    else {
        let lastChildNode = nodeStore.findNodeById(fatherNode.childrenId[fatherNode.childrenId.length - 1])
        if (!nodeStore.isLocatedLeftOfMateNode(lastChildNode)) {
            fatherNode.childrenId.push(daughterNode.id)
            motherNode.childrenId.push(daughterNode.id)

            // 计算sonNode的位置
            daughterNode.position = {
                x: lastChildNode.position.x,
                y: lastChildNode.position.y
            }

            // 计算sonNode的horizontalPosition属性
            daughterNode.data.horizontalPosition = lastChildNode.data.horizontalPosition + 1

            // 修改与sonNode同一代的后面节点的horizontalPosition属性
            nodeStore.nodes.forEach(node => {
                if (node.data.generation === daughterNode.data.generation &&
                    node.data.horizontalPosition >= daughterNode.data.horizontalPosition &&
                    node.id !== daughterNode.id
                ) {
                    node.data.horizontalPosition = node.data.horizontalPosition + 1
                }
            })

            nodeStore.addNode(daughterNode)

            adjustNodesPositionToAddBrother(daughterNode)
        }
        else {
            fatherNode.childrenId.splice(fatherNode.childrenId.length - 1, 0, daughterNode.id)
            motherNode.childrenId.splice(motherNode.childrenId.length - 1, 0, daughterNode.id)

            // 计算sonNode的位置
            daughterNode.position = {
                x: lastChildNode.position.x,
                y: lastChildNode.position.y
            }

            // 计算sonNode的horizontalPosition属性
            daughterNode.data.horizontalPosition = lastChildNode.data.horizontalPosition

            // 修改与sonNode同一代的后面节点的horizontalPosition属性
            nodeStore.nodes.forEach(node => {
                if (node.data.generation === daughterNode.data.generation &&
                    node.data.horizontalPosition >= daughterNode.data.horizontalPosition &&
                    node.id !== daughterNode.id
                ) {
                    node.data.horizontalPosition = node.data.horizontalPosition + 1
                }
            })

            nodeStore.addNode(daughterNode)

            adjustNodesPositionToAddBrother(lastChildNode)
        }
    }

    // 添加父母和sonNode的连线
    let source = ''
    let target = ''
    let sourceHandle = 'source-right'
    let targetHandle = 'target-left'

    source = daughterNode.fatherId
    target = daughterNode.id
    sourceHandle = 'source-right'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    source = daughterNode.motherId
    target = daughterNode.id
    sourceHandle = 'source-left'
    targetHandle = 'target-top'
    addEdge(source, target, sourceHandle, targetHandle, 'step')

    nodeInformationDrawerVisible.value = true
    drawerClickNode.value = daughterNode
}

function computeDeleteNode(sourceNode) {
    nodeStore.deleteNodes = []
    nodeStore.deleteNodes.push(sourceNode.id)
    deleteDescendantsNode(sourceNode)
    // 当该节点有父母，且有配偶时，则还需要删除配偶及配偶的祖辈
    if (sourceNode.fatherId !== '' && sourceNode.mateId !== '') {
        const mateNode = nodeStore.findNodeById(sourceNode.mateId)
        nodeStore.deleteNodes.push(mateNode.id)
        deleteAncestorsNode(mateNode)
    }

    function deleteDescendantsNode(currentNode) {
        if (!currentNode || currentNode.childrenId.length === 0) return
    
        currentNode.childrenId.forEach(childId => {
            const childNode = nodeStore.findNodeById(childId)
            nodeStore.deleteNodes.push(childNode.id)
            deleteDescendantsNode(childNode)
    
            // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
            if (childNode.mateId !== '') {
                const mateNode = nodeStore.findNodeById(childNode.mateId)
                nodeStore.deleteNodes.push(mateNode.id)
                deleteAncestorsNode(mateNode)
            }
        });
    }
    
    function deleteAncestorsNode(currentNode) {
        if (!currentNode || (!currentNode.fatherId && !currentNode.motherId)) return
        
        // 遍历父亲及其祖辈
        if (currentNode.fatherId) {
            const fatherNode = nodeStore.findNodeById(currentNode.fatherId)
            nodeStore.deleteNodes.push(fatherNode.id)
            deleteAncestorsNode(fatherNode)
        }
    
        // 遍历母亲及其祖辈
        if (currentNode.motherId) {
            const motherNode = nodeStore.findNodeById(currentNode.motherId)
            nodeStore.deleteNodes.push(motherNode.id)
            deleteAncestorsNode(motherNode)
        }
    
        //如果该节点的父母有其他子女，则遍历该节点的父母的所有子女及其子辈
        if (currentNode.fatherId && currentNode.motherId) {
            const motherNode = nodeStore.findNodeById(currentNode.motherId)
            motherNode.childrenId.forEach(childId => { 
                if (childId !== currentNode.id) {
                    const childNode = nodeStore.findNodeById(childId)
                    nodeStore.deleteNodes.push(childNode.id)
                    deleteDescendantsNode(childNode)
    
                    // 判断该节点是否有配偶，如果有，则还需要遍历配偶的祖辈
                    if (childNode.mateId !== '') {
                        const mateNode = nodeStore.findNodeById(childNode.mateId)
                        nodeStore.deleteNodes.push(mateNode.id)
                        deleteAncestorsNode(mateNode)
                    }
                }
            })
        }
    }
}

function deleteNode(sourceNode) {
    // 调整删除节点后的家系图
    deleteNodeAdjustPosition(sourceNode)

    // 如果sourceNode有父母节点，则修改父母节点的childrenId数组
    if (sourceNode.fatherId !== '' && sourceNode.motherId !== '') {
        let fatherNode = nodeStore.findNodeById(sourceNode.fatherId)
        let motherNode = nodeStore.findNodeById(sourceNode.motherId)

        fatherNode.childrenId = fatherNode.childrenId.filter(childId => childId !== sourceNode.id)
        motherNode.childrenId = motherNode.childrenId.filter(childId => childId !== sourceNode.id)
    }
    // 如果sourceNode有配偶节点，则修改配偶的mateId和childrenId属性
    if (sourceNode.mateId !== '') {
        let mateNode = nodeStore.findNodeById(sourceNode.mateId)
        mateNode.mateId = ''
        mateNode.childrenId = []
    }

    // 删除节点
    nodeStore.deleteNodes = Array.from(new Set(nodeStore.deleteNodes))
    nodeStore.deleteNodes.forEach(nodeId => {
        nodeStore.deleteNodeById(nodeId)
    })

    // 修改每个节点的generation和horizontalPosition属性
    nodeStore.sortNodesByGenerationAndHorizontalPosition()
    // 重新赋值 generation
    let currentGeneration = 1
    let previousGeneration = nodeStore.nodes[0].data.generation
    nodeStore.nodes[0].data.generation = currentGeneration

    for (let i = 1; i < nodeStore.nodes.length; i++) {
        if (nodeStore.nodes[i].data.generation !== previousGeneration) {
            currentGeneration++
            previousGeneration = nodeStore.nodes[i].data.generation
        }
        nodeStore.nodes[i].data.generation = currentGeneration
    }

    // 对每个相同 generation 的节点按 horizontalPosition 重新赋值
    let i = 0
    while (i < nodeStore.nodes.length) {
        let j = i
        // 找到相同 generation 的范围
        while (j < nodeStore.nodes.length && nodeStore.nodes[j].data.generation === nodeStore.nodes[i].data.generation) {
            j++
        }

        // 对相同 generation 的节点进行按 horizontalPosition 重新编号
        let currentPosition = 1;
        for (let k = i; k < j; k++) {
            nodeStore.nodes[k].data.horizontalPosition = currentPosition++;
        }

        // 移动 i 指针到下一个不同 generation 的位置
        i = j;
    }
}

export {
    nodeMenuVisible,
    menuClickNode,
    menuPosition,
    onNodeContextMenu,
    addParentsNode,
    addMateNode,
    addBrotherNode,
    addSisterNode,
    addSonNode,
    addDaughterNode,
    computeDeleteNode,
    deleteNode,
}