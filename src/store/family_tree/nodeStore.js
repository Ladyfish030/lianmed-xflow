import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import * as NodeInitAttribute from '@/components/family_tree/nodes/attribute/NodeInitAttribute'
import { FamilyTreeNodeTypeEnum } from '@/enums/family_tree/FamilyTreeNodeTypeEnum'

import { removeEdgeByNodeId } from '@/hooks/family_tree/useEdge'

export const useNodeStore = defineStore('nodeStore', () => {
    const nodes = ref([])
    const deleteNodes = ref([])

    function getNodeId() {
        return uuidv4();
    }

    function addNode(node) {
        if (node !== undefined && node !== null) {
            nodes.value.push(reactive(node));
        }
    }

    function findNodeById(nodeId) {
        return nodes.value.find(node => node.id === nodeId)
    }

    function deleteNodeById(nodeId) {
        removeEdgeByNodeId(nodeId)
        nodes.value = nodes.value.filter((node) => node.id !== nodeId)
    }

    function initNode() {
        let newNode = JSON.parse(JSON.stringify(NodeInitAttribute.initFamilyTreeNode));
        newNode.id = getNodeId();
        newNode.type = FamilyTreeNodeTypeEnum.FAMILY_TREE_NODE;
        newNode.style = {
            width: `${newNode.dimensions.width}px`,
            height: `${newNode.dimensions.height}px`,
        };
        return reactive(newNode);
    }

    function addInitNode() {
        let newNode = initNode();
        newNode.data.isProband = true;
        newNode.position = {
            x: 400,
            y: 200
        };
        addNode(newNode);
    }

    // 判断某个节点是否位于父母节点的左边（如果该节点没有配偶，则返回false）
    function isLocatedLeftOfMateNode(sourceNode) {
        const nextNode = nodes.value.find((node) => node.data.generation === sourceNode.data.generation && node.data.horizontalPosition === sourceNode.data.horizontalPosition + 1)
        if (nextNode !== undefined && sourceNode.mateId === nextNode.id) {
            return true
        }
        else {
            return false
        }
    }

    function findTargetNode(sourceNode, result = []) {
        // 如果存在母亲节点
        if (sourceNode.motherId !== '') {
            const motherNode = findNodeById(sourceNode.motherId)
            // 如果 sourceNode 在父母节点的左边并且是最后一个孩子，保存sourceNode
            if (isLocatedLeftOfMateNode(sourceNode) && sourceNode.id === motherNode.childrenId[motherNode.childrenId.length - 1]) {
                result.push(sourceNode)  // 将目标节点保存到数组中
                
                // 检查目标节点是否有孩子节点
                if (sourceNode.childrenId.length !== 0) {
                    // 找到配偶节点
                    const mateNode = findNodeById(sourceNode.mateId)
                    if (mateNode) {
                        findTargetNode(mateNode, result);  // 将配偶节点作为新的 sourceNode 继续递归
                    }
                }
            }
        }

        // 如果有子节点，递归查找子节点
        if (sourceNode.childrenId.length !== 0) {
            for (const childId of sourceNode.childrenId) {
                const childNode = findNodeById(childId);
                findTargetNode(childNode, result);  // 继续递归传递 result 数组
            }
        }

        // 如果没有找到匹配的目标节点，返回结果数组
        return result.length > 0 ? Array.from(new Set(result)) : null;
    }

    function findLastElderInFront(sourceNode) {
        let preNode = nodes.value.find((node) => node.data.generation === sourceNode.data.generation && node.data.horizontalPosition === sourceNode.data.horizontalPosition - 1)
        if (preNode === undefined) return null

        while (preNode !== undefined) {
            if (preNode.motherId !== '') {
                const motherNode = findNodeById(preNode.motherId)
                if (motherNode.motherId !== '') {
                    const grandMother = findNodeById(motherNode.motherId)
                    const lastChild = findNodeById(grandMother.childrenId[grandMother.childrenId.length - 1])
                    if (lastChild.mateId !== '' && isLocatedLeftOfMateNode(lastChild)) {
                        const lastChildMate = findNodeById(lastChild.mateId)
                        return lastChildMate
                    }
                    else {
                        return lastChild
                    }
                }
                else {
                    return motherNode
                }
            }
            preNode = nodes.value.find((node) => node.data.generation === preNode.data.generation && node.data.horizontalPosition === preNode.data.horizontalPosition - 1)
        }
        return null
    }

    /**
     * 查找最顶层的母亲节点
     */
    function findTheMotherAtTheTopRight(sourceNode) {
        if (sourceNode === null || sourceNode === undefined) return null 
        
        let currentNode = sourceNode
        while (currentNode.motherId !== '') {
            currentNode = findNodeById(currentNode.motherId)
        }

        return currentNode
    }

    /**
     * 按代数和横向位置对节点进行排序
     * 先按 generation 升序，再按 horizontalPosition 升序
     */
    function sortNodesByGenerationAndHorizontalPosition() {
        nodes.value.sort((a, b) => {
            if (a.data.generation === b.data.generation) {
                return a.data.horizontalPosition - b.data.horizontalPosition;
            }
            return a.data.generation - b.data.generation;
        });
    }

    return {
        nodes,
        deleteNodes,
        getNodeId,
        addNode,
        findNodeById,
        deleteNodeById,
        initNode,
        addInitNode,
        isLocatedLeftOfMateNode,
        findTargetNode,
        findLastElderInFront,
        findTheMotherAtTheTopRight,
        sortNodesByGenerationAndHorizontalPosition,
    };
});
