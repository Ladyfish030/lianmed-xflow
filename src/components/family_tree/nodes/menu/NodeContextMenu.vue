<template>
    <div v-if="nodeMenuVisible" class="menu-container"
        :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }">
        <div class="container">
            <button @click="addParentsHandler" class="button-container" :disabled="isAddParentsDisabled"
                :class="{ disabled: isAddParentsDisabled }">
                <el-icon :size="20">
                    <AddParentsIcon :color="isAddParentsDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增父母</span>
            </button>
            <button @click="addMateHandler" class="button-container" :disabled="isAddMateDisabled"
                :class="{ disabled: isAddMateDisabled }">
                <el-icon :size="20">
                    <AddMateIcon :color="isAddMateDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增配偶</span>
            </button>
            <button @click="addBrotherHandler" class="button-container" :disabled="isAddBrotherOrSisterDisabled"
                :class="{ disabled: isAddBrotherOrSisterDisabled }">
                <el-icon :size="20">
                    <AddBrotherIcon :color="isAddBrotherOrSisterDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增兄弟</span>
            </button>
            <button @click="addSisterHandler" class="button-container" :disabled="isAddBrotherOrSisterDisabled"
                :class="{ disabled: isAddBrotherOrSisterDisabled }">
                <el-icon :size="20">
                    <AddSisterIcon :color="isAddBrotherOrSisterDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增姐妹</span>
            </button>
            <button @click="addSonHandler" class="button-container" :disabled="isAddSonOrDaughterDisabled"
                :class="{ disabled: isAddSonOrDaughterDisabled }">
                <el-icon :size="20">
                    <AddSonIcon :color="isAddSonOrDaughterDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增儿子</span>
            </button>
            <button @click="addDaughterHandler" class="button-container" :disabled="isAddSonOrDaughterDisabled"
                :class="{ disabled: isAddSonOrDaughterDisabled }">
                <el-icon :size="20">
                    <AddDaughterIcon :color="isAddSonOrDaughterDisabled ? '#ccc' : '#000'" />
                </el-icon>
                <span>新增女儿</span>
            </button>
            <el-divider style="margin: 5px;" />
            <button @click="deleteNodeHandler" class="button-container" :disabled="isDeleteNodeDisabled"
                :class="{ disabled: isDeleteNodeDisabled }">
                <el-icon :size="15" color="#f89898" style="margin-left: 8px;margin-right: 2px;">
                    <Delete :color="isDeleteNodeDisabled ? '#ccc' : '#f89898'" />
                </el-icon>
                <span :style="{ color: isDeleteNodeDisabled ? '#ccc' : '#f89898' }">删除</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import AddParentsIcon from '@/assets/svg/family_tree/AddParentsIcon.vue'
import AddMateIcon from '@/assets/svg/family_tree/AddMateIcon.vue'
import AddBrotherIcon from '@/assets/svg/family_tree/AddBrotherIcon.vue'
import AddSisterIcon from '@/assets/svg/family_tree/AddSisterIcon.vue'
import AddSonIcon from '@/assets/svg/family_tree/AddSonIcon.vue'
import AddDaughterIcon from '@/assets/svg/family_tree/AddDaughterIcon.vue'

import {
    nodeMenuVisible,
    menuClickNode,
    menuPosition,
    addParentsNode,
    addMateNode,
    addBrotherNode,
    addSisterNode,
    addSonNode,
    addDaughterNode,
    computeDeleteNode,
    deleteNode,
} from '@/hooks/family_tree/useMenu.js'

import { useNodeStore } from '@/store/family_tree/nodeStore'

const nodeStore = useNodeStore()

// 计算“新增父母”按钮是否禁用
const isAddParentsDisabled = computed(() => {
    // 已有父母则禁用
    if (menuClickNode?.value.fatherId !== '' || menuClickNode?.value.motherId !== '') return true

    // 有配偶且配偶有父亲时，判断是否在可添加父母的位置
    if (menuClickNode?.value.mateId !== '') {
        const mateNode = nodeStore.findNodeById(menuClickNode?.value.mateId)
        if (mateNode.fatherId !== '') {
            const fatherNode = nodeStore.findNodeById(mateNode.fatherId)
            if (!((nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === fatherNode.childrenId.length - 1) ||
                (!nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === 0))) {
                    return true
            }
        }
    }
    return false
})

// 计算“新增配偶”按钮是否禁用
const isAddMateDisabled = ref(menuClickNode?.value.mateId !== '')

// 计算“新增兄弟/姐妹”按钮是否禁用
const isAddBrotherOrSisterDisabled = computed(() => {
    // 没有父亲时，判断配偶相关逻辑
    if (menuClickNode?.value.fatherId === '') {
        if (menuClickNode?.value.mateId !== '') {
            const mateNode = nodeStore.findNodeById(menuClickNode?.value.mateId)
            if (mateNode.fatherId !== '') {
                const fatherNode = nodeStore.findNodeById(mateNode.fatherId)
                if (!((nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === fatherNode.childrenId.length - 1) ||
                    (!nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === 0))) {
                    return true
                }
            }
        }
    }
    return false
})

// 计算“新增儿子/女儿”按钮是否禁用
const isAddSonOrDaughterDisabled = computed(() => {
    // 有父亲时，判断是否在可添加子女的位置
    if (menuClickNode?.value.fatherId !== '') {
        const fatherNode = nodeStore.findNodeById(menuClickNode?.value.fatherId)
        if (!((nodeStore.isLocatedLeftOfMateNode(menuClickNode?.value) && fatherNode.childrenId.indexOf(menuClickNode?.value.id) === fatherNode.childrenId.length - 1) ||
            (!nodeStore.isLocatedLeftOfMateNode(menuClickNode?.value) && fatherNode.childrenId.indexOf(menuClickNode?.value.id) === 0) ||
            (menuClickNode?.value.mateId === '' && (fatherNode.childrenId.indexOf(menuClickNode?.value.id) === 0 || fatherNode.childrenId.indexOf(menuClickNode?.value.id) === fatherNode.childrenId.length - 1)))) {
                return true
        }
        // 判断兄弟节点是否已有子女，若有则禁用
        return fatherNode.childrenId.some(childId => {
            if (childId !== menuClickNode?.value.id) {
                const childNode = nodeStore.findNodeById(childId)
                if (childNode.childrenId.length > 0) {
                    return true
                }
            }
            return false
        })
    }
    // 没有父亲但有配偶时，判断配偶相关逻辑
    if (menuClickNode?.value.mateId !== '') {
        const mateNode = nodeStore.findNodeById(menuClickNode?.value.mateId)
        if (mateNode.fatherId !== '') {
            const fatherNode = nodeStore.findNodeById(mateNode.fatherId)
            if (!((nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === fatherNode.childrenId.length - 1) ||
                (!nodeStore.isLocatedLeftOfMateNode(mateNode) && fatherNode.childrenId.indexOf(mateNode.id) === 0))) {
                return true
            }
            // 判断兄弟节点是否已有子女，若有则禁用
            return fatherNode.childrenId.some(childId => {
                if (childId !== mateNode.id) {
                    const childNode = nodeStore.findNodeById(childId)
                    if (childNode.childrenId.length > 0) {
                        return true
                    }
                }
                return false
            })
        }
    }
    return false
})

// 计算"删除"按钮是否禁用（仅剩一个节点时禁用）
const isDeleteNodeDisabled = computed(() => {
    return nodeStore.nodes.length === 1
})

// 新增配偶
function addMateHandler() {
    addMateNode(menuClickNode.value)
}

// 新增父母
function addParentsHandler() {
    addParentsNode(menuClickNode.value)
}

// 新增兄弟
function addBrotherHandler() {
    addBrotherNode(menuClickNode.value)
}

// 新增姐妹
function addSisterHandler() {
    addSisterNode(menuClickNode.value)
}

// 新增儿子
function addSonHandler() {
    addSonNode(menuClickNode.value)
}

// 新增女儿
function addDaughterHandler() {
    addDaughterNode(menuClickNode.value)
}

// 删除节点，弹窗确认
function deleteNodeHandler() {
    computeDeleteNode(menuClickNode.value)
    ElMessageBox.confirm('确定删除该节点？突出显示的所有节点都将被删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
    })
        .then(() => {
            deleteNode(menuClickNode.value)
            done()
        })
        .catch(() => {
            nodeStore.deleteNodes = []
            // catch error
        })
}
</script>

<style scoped>
.menu-container {
    position: absolute;
    width: 150px;
    border: 1px solid #e9e9eb;
    border-radius: 5px;
    background-color: white;
    -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    z-index: 1000;
    padding: 5px;
}

.container {
    height: 100%;
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.button-container {
    height: 23px;
    width: 100%;
    background-color: white;
    border: 0px;
    border-radius: 3px;
    margin-top: 3px;
    margin-bottom: 3px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: left;
    -ms-flex-pack: left;
    justify-content: left;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    font-size: 14px;
}

.button-container:hover {
    background-color: #f4f4f5;
    cursor: pointer;
}

.button-container>span {
    margin-left: 5px;
    line-height: 100%;
}

.button-container.disabled {
  cursor: not-allowed;
  background-color: white;
}

.button-container.disabled span {
  color: #ccc;
}

.el-icon {
    margin-left: 5px;
}
</style>