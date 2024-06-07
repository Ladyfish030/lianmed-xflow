<template>
  <el-table :data="tableData" border style="width: 100%" class="content-box">
    <el-table-column fixed prop="date" label="画布">
      <template #default="scope">
        <el-input
          v-model="scope.row.name"
          @change="changePaintName(scope.row)"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="140">
      <template #default="scope">
        <el-button size="small" @click.prevent="showPaint(scope)"
          >展示</el-button
        >
        <el-button size="small" @click.prevent="deleteRow(scope)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setPaintName, showCanvas, setPaintId } from '../hooks/usePaint'
import { getCanvas, updateCanvasName, deleteCanvas } from '../service/CanvasService'
import { useVueFlow } from '@vue-flow/core'
const { fromObject } = useVueFlow()
const tableData = ref([])
onMounted(() => {
  getCanvas()
    .then((res) => {
      tableData.value = res
    })
    .catch((err) => {
      console.log(err)
    })
})
function changePaintName(row) {
  updateCanvasName({ name: row.name, id: String(row.id) }).then((res) => {
    console.log(res)
  })
}
function deleteRow(scope) {
  //需要给后端发请求
  deleteCanvas({ id: String(scope.row.id) }).then((res) => {
    ElMessage({
      type: 'success',
      message: '删除画布成功',
    })
  })
  tableData.value.splice(scope.$index, 1)
}
function showPaint(scope) {
  setPaintName(scope.row.name)
  setPaintId(scope.row.id)
  fromObject(scope.row.canvas.paint)
  showCanvas(scope.row.canvas)
}
</script>
<style scoped>
template {
  display: block !important;
}
.content-box {
  position: absolute;
  top: 10px;
  left: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}
</style>
../service/api