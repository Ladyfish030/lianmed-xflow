<template>
    <div ref="refContainer">
    <div class="parameter-tool-container">
        <el-tooltip content="新增" placement="bottom" effect="dark" :hide-after="0">
            <button class="tool-button" @click="handleAdd()">
                <AddIcon />
            </button>
        </el-tooltip>
        <el-tooltip content="删除所选" placement="bottom" effect="dark" :hide-after="0">
            <button class="tool-button" @click="handleDeleteSelected()">
                <DeleteIcon />
            </button>
        </el-tooltip>
        <el-tooltip content="删除所有" placement="bottom" effect="dark" :hide-after="0">
            <button class="tool-button" @click="handleDeleteAll()">
                <AllDeleteIcon />
            </button>
        </el-tooltip>
    </div>

    <el-table 
        :data="tableData" 
        size="small" 
        style="width: 100%;"
        max-height="100px" 
        :highlight-current-row="true"
        @row-click="handleRowClick">
        <el-table-column label="Key" style="width: 50%;">
            <template #default="scope">
                <div class="cell-content">
                    <el-text 
                        v-if="scope.row.key !== editingCell.row || editingCell.column !== 'Key'" 
                        size="small"
                        style="width: 100%;" 
                        truncated 
                        @dblclick="intoEditModeHandler(scope)"
                    >
                        {{ scope.row.key }}
                    </el-text>
                    <el-input 
                        v-else 
                        v-model="editingContent" 
                        size="small" 
                        class="input-content"
                        @change="handleEditContent(scope)"
                    >
                    </el-input>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="Value" style="width: 50%;">
            <template #default="scope">
                <div class="cell-content">
                    <el-text 
                        v-if="scope.row.key !== editingCell.row || editingCell.column !== 'Value'" 
                        size="small"
                        style="width: 100%;" 
                        truncated 
                        @dblclick="intoEditModeHandler(scope)"
                    >
                        {{ scope.row.value }}
                    </el-text>
                    <el-input 
                        v-else 
                        v-model="editingContent" 
                        size="small" 
                        class="input-content"
                        @change="handleEditContent(scope)"
                    >
                    </el-input>
                </div>
            </template>
        </el-table-column>
    </el-table>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import AddIcon from '@/assets/svg/AddIcon.vue'
import DeleteIcon from '@/assets/svg/DeleteIcon.vue'
import AllDeleteIcon from '@/assets/svg/AllDeleteIcon.vue'

const props = defineProps({
    data: Array,
})

const emit = defineEmits(['edit', 'delete', 'add'])

const tableData = ref(props.data || [])

const editingCell = ref({ row: null, column: null })
const editingContent = ref('')
const selectedRow = ref(null)

const refContainer = ref(null)

function handleAdd() {
    let baseKey = "Key"
    let index = 1
    let newKey = baseKey

    while (tableData.value.some(item => item.key === newKey)) {
        newKey = baseKey + "_" + String(index)
        index++
    }

    const newItem = {
        key: newKey,
        value: "Value"
    }

    tableData.value.push(newItem)
    emit('add', tableData.value)
}

function handleDeleteSelected() {
    if (selectedRow.value === null) {
        ElMessage({
            type: 'warning',
            message: '请选择要删除的行',
        })
        return
    }
    tableData.value = tableData.value.filter(item => item.key !== selectedRow.value)
    selectedRow.value = null
    emit('delete', tableData.value)
}

function handleDeleteAll() {
    if (tableData.value.length === 0) {
        ElMessage({
            type: 'warning',
            message: '无可删除数据',
        })
        return
    }
    ElMessageBox.confirm('确定删除所有数据？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    })
        .then(() => {
            tableData.value = []
            emit('delete', tableData.value)
            done()
        })
        .catch(() => {
        })
}

function intoEditModeHandler(scope) {
    selectedRow.value = scope.row.key
    editingCell.value = { row: scope.row.key, column: scope.column.label }
    editingContent.value = scope.column.label === 'Key' ? scope.row.key : scope.row.value
}

function handleEditContent(row) {
    if (editingCell.value.column === 'Key') {
        if (editingContent.value === '') {
            ElMessage({
                type: 'error',
                message: 'Key不能为空',
            })
            return
        }
        if (tableData.value.some(item => item.key === editingContent.value)) {
            ElMessage({
                type: 'error',
                message: 'Key不能重复',
            })
            return
        }
        else {
            tableData.value[row.$index].key = editingContent.value
            selectedRow.value = editingContent.value
        }
    } else {
        if (editingContent.value === '') {
            ElMessage({
                type: 'error',
                message: 'Value不能为空',
            })
            return
        }
        else {
            tableData.value[row.$index].value = editingContent.value
            editingCell.value = { row: null, column: null }
            editingContent.value = ''
        }
    }
    emit('edit', tableData.value)
}

function handleRowClick(row) {
    selectedRow.value = row.key
}

function handleClickOutside(event) {
    if (editingCell.value !== null && !event.target.closest('.input-content .el-input__inner')) {
        editingCell.value = { row: null, column: null }
        editingContent.value = ''
    }
}

onMounted(() => {
    if (refContainer.value) {
        refContainer.value.addEventListener('click', handleClickOutside);
    }
})

onBeforeUnmount(() => {
    if (refContainer.value) {
        refContainer.value.removeEventListener('click', handleClickOutside);
    }
})
</script>

<style scoped>
.parameter-tool-container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}

.tool-button {
    margin-left: 5px;
    border-radius: 5px;
    border-color: transparent;
    background-color: transparent;
    height: 20px;
    width: 20px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}

.tool-button:hover {
    -webkit-transform: scale(1.05);
        -ms-transform: scale(1.05);
            transform: scale(1.05);
    -webkit-transition: 0.25s all ease-in-out;
    -o-transition: 0.25s all ease-in-out;
    transition: 0.25s all ease-in-out;
    cursor: pointer;
    background-color: #e9e9eb;
}

.cell-content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    height: 25px;
    width: 100%;
}
</style>