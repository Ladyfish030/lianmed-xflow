<template>
  <el-popover placement="bottom" :width="286" trigger="click" :hide-after="0" @hide="popoverHideHandler"
    @before-enter="loadHistoryCanvas">
    <template #reference>
      <div class="tooltip-container">
        <button @click="" class="tool-button">
          <HistoryCanvasIcon />
        </button>
      </div>
    </template>
    <el-table :data="historyCanvasList" v-loading="loading" border size="small" style="width: fit-content;"
      max-height="300">
      <el-table-column label="业务名" width="150">
        <template #default="scope">
          <div class="cell-content">
            <el-tooltip v-if="editingIndex !== scope.$index" effect="dark" placement="top-start" :hide-after="0">
              <template #content>{{ scope.row.name }}</template>
              <el-text  size="small" style="width: 100%;" truncated>
                {{ scope.row.name }}
              </el-text>
            </el-tooltip>
            <el-input v-else v-model="editingContent" size="small" class="input-content"
              @change="renameCanvasHandler(scope.row)">
            </el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110">
        <template #default="scope">
          <el-tooltip :hide-after="0" content="重命名" placement="bottom" effect="dark">
            <button class="tool-button rename-button" @click.prevent="renameClickHandler(scope.$index, scope.row.name)">
              <el-icon size="15">
                <Edit />
              </el-icon>
            </button>
          </el-tooltip>

          <el-tooltip :hide-after="0" content="导入" placement="bottom" effect="dark">
            <button class="tool-button" @click.prevent="importCanvasHandler(scope.row)">
              <el-icon size="15">
                <Download />
              </el-icon>
            </button>
          </el-tooltip>

          <el-tooltip :hide-after="0" content="删除" placement="bottom" effect="dark">
            <button class="tool-button" @click.prevent="deleteCanvasHandler(scope.row.id)">
              <el-icon size="15" color="#f89898">
                <Delete />
              </el-icon>
            </button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-popover>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import useCanvasManage from '@/hooks/useCanvasManage'
import { getAllCanvas, updateCanvas, deleteCanvas } from '@/service/CanvasService'

import HistoryCanvasIcon from '@/assets/svg/HistoryCanvasIcon.vue'

const {
  historyCanvasList,
  importCanvas,
  getCanvasIndexById,
  getCanvasById,
  deleteCanvasByIndex
} = useCanvasManage()

// 用于记录正在编辑的行的索引，初始值为 -1 表示没有行在编辑状态
const editingIndex = ref(-1)
const editingContent = ref('')

const loading = ref(true)

async function loadHistoryCanvas() {
  loading.value = true
  await getAllCanvas()
    .then((res) => {
      historyCanvasList.value = res
    })
    .catch((err) => {

    })
  loading.value = false
}

function renameClickHandler(index, name) {
  editingIndex.value = index
  editingContent.value = name
}

function popoverHideHandler() {
  editingIndex.value = -1
}

function handleClickOutside(event) {
  if (editingIndex.value !== -1 && !event.target.closest('.input-content .el-input__inner') && !event.target.closest('.rename-button')) {
    editingIndex.value = -1
  }
}

async function renameCanvasHandler(editedCanvas) {
  if (String(editingContent.value).trim() === '') {
    ElMessage({
        type: 'error',
        message: '名字不能为空',
    })
    return
  }
  await updateCanvas({
    id: String(editedCanvas.id),
    name: String(editingContent.value).trim(),
  })
    .then((res) => {
      ElMessage({
        type: 'success',
        message: '修改成功',
      })
      const canvas = getCanvasById(editedCanvas.id)
      if (canvas !== null) {
        canvas.name = editingContent.value
      }
      loading.value = true
      getAllCanvas()
        .then((res) => {
          historyCanvasList.value = res
        })
        .catch((err) => {

        })
      loading.value = false
    })
    .catch((error) => {
      ElMessage({
        type: 'error',
        message: '修改失败',
      })
    })

  editingIndex.value = -1
}

function importCanvasHandler(newCanvas) {
  var canvas = getCanvasById(newCanvas.id)
  if (canvas !== null) {
    ElMessage({
      type: 'warning',
      message: '画布已存在',
    })
    return
  }
  else {
    canvas = {
      id: newCanvas.id,
      name: newCanvas.name,
      paint: newCanvas.canvas.paint,
      flowList: newCanvas.canvas.flowList,
      parentPos: newCanvas.canvas.parentPos,
    }
    importCanvas(canvas)
  }
}

async function deleteCanvasHandler(id) {
  await ElMessageBox.confirm('确定删除该画布？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      deleteCanvas({ id: String(id) })
        .then((res) => {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          const canvas = getCanvasById(id)
          if (canvas !== null) {
            const index = getCanvasIndexById(id)
            deleteCanvasByIndex(index)
          }
          getAllCanvas()
            .then((res) => {
              historyCanvasList.value = res
            })
            .catch((err) => {
              
            })
        })
        .catch((error) => {
          ElMessage({
            type: 'error',
            message: '删除失败',
          })
        })
    })
    .catch(() => {

    })
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.cell-content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.input-content {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 100%;
}

.input-content .el-input__inner {
  height: 100%;
}

.tool-button {
  margin-left: 5px;
  border-radius: 5px;
  border-color: transparent;
  background-color: transparent;
  height: 25px;
  width: 25px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.tool-button:hover {
  -webkit-transform: scale(105%);
  -ms-transform: scale(105%);
  transform: scale(105%);
  -webkit-transition: 0.25s all ease-in-out;
  -o-transition: 0.25s all ease-in-out;
  transition: 0.25s all ease-in-out;
  cursor: pointer;
  background-color: #e9e9eb;
}

.tooltip-container {
  height: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
