<template>
  <el-table :data="tableData" border style="width: 100%" class="content-box">
    <el-table-column fixed prop="date" label="画布">
      <template #default="scope">
        <el-input
          v-model="scope.row.paintName"
          @change="changePaintName"
        ></el-input>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="140">
      <template #default="scope">
        <el-button type="text" size="small">展示</el-button>
        <el-button
          type="text"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
//到时候数据从后端拿
const tableData = ref([
  {
    paintName: '画布1',
  },
  {
    paintName: '画布2',
  },
  {
    paintName: '画布3',
  },
  {
    paintName: '画布4',
  },
  {
    paintName: '画布5',
  },
])
function changePaintName() {
  //需要给后端发请求
}
const deleteRow = (index: number) => {
  tableData.value.splice(index, 1)
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
