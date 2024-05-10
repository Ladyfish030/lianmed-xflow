<template>
  <div class="form-container">
    <div class="database-container">
      <div class="database-span-container">
        <span class="database-span">数据库列表</span>
      </div>
      <div class="database-right-container">
        <div class="scrollbar-container">
          <el-scrollbar>
            <div class="database-button-container" v-for="(item, index) in databaseList" :key="index">
              <el-button class="database-button" plain @click="showDatabaseDetail(item)" type="primary">
                <el-text class="database-text" truncated>
                  {{ item.name }}
                </el-text>
              </el-button>
              <el-button class="delete-button" @click="removeDatabaseHandler(item.name)">
                <el-icon :size="20" color="#f89898">
                  <Delete />
                </el-icon>
              </el-button>
            </div>
          </el-scrollbar>
        </div>
        <div class="add-button-container">
          <ChoiceAddIcon class="add-button" @click="handleBeforeAddDatabase" />
        </div>
      </div>
    </div>
    <el-divider class="divider" />
    <div class="form-item">
      <label>数据库</label>
      <el-select v-model="database" placeholder="" class="input-field">
        <el-option v-for="(item, index) in databaseList" :key="index" :label="item.name" :value="item.name" />
      </el-select>
    </div>
    <div class="form-item">
      <label>SQL执行语句</label>
      <el-input v-model="sqlCommand" autosize type="textarea" class="input-field"></el-input>
    </div>
  </div>

  <el-dialog v-model="databaseFormVisible" title="数据库属性" width="400">
    <el-form :model="form">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="URL" :label-width="formLabelWidth">
        <el-input v-model="form.url" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类型" :label-width="formLabelWidth">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="databaseFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDatabase">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSave, saveAttributeComplete, drawerClickNode } from '../../../hooks/useDrawer'
import {
  databaseList,
  findDatabaseByName,
  insertDatabaseToList,
  removeDatabaseFromList,
  editDatabaseFromList,
} from '../../../hooks/useDatabase'
import { nodes } from '@/hooks/useNode'
import { NodeType } from '@/enums/NodeType'
import ChoiceAddIcon from '@/assets/svg/ChoiceAddIcon.vue'

const database = ref(drawerClickNode?.value.data.name || '')
const sqlCommand = ref(drawerClickNode?.value.data.sqlCommand || '')

const { updateNode } = useVueFlow()
const databaseFormVisible = ref(false)
const isAddNewDatabase = ref(false)
var currentDatabase = null
const formLabelWidth = '70px'
const form = reactive({
  name: '',
  url: '',
  type: '',
})

function removeDatabaseHandler(databaseName) {
  ElMessageBox.confirm(
    '确定删除该数据库配置？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }
  )
    .then(() => {
      nodes.value.forEach((node, index) => {
        if (node.type == NodeType.DATABASE && node.data.name == databaseName) {
          node.data.name = ''
          node.data.type = ''
          node.data.url = ''
        }
      });
      removeDatabaseFromList(databaseName)
      if (database.value == databaseName) {
        database.value = ''
      }
      return
    })
    .catch(() => {
    })
}

function showDatabaseDetail(item) {
  form.name = item.name
  form.url = item.url
  form.type = item.type
  currentDatabase = item
  isAddNewDatabase.value = false
  databaseFormVisible.value = true
}

function handleBeforeAddDatabase() {
  form.name = ''
  form.url = ''
  form.type = ''
  isAddNewDatabase.value = true
  databaseFormVisible.value = true
}

function saveDatabase() {
  const newDatabase = {
    name: form.name,
    url: form.url,
    type: form.type
  }
  if (newDatabase.name == '') {
    ElMessage({
      message: '名称不能为空',
      type: 'error',
    })
    return
  }
  if (isAddNewDatabase.value) {
    if (insertDatabaseToList(newDatabase)) {
      ElMessage({
        message: '保存成功',
        type: 'success',
      })
    }
    else {
      ElMessage({
        message: '保存失败，名称不能重复',
        type: 'error',
      })
      return
    }
    databaseFormVisible.value = false
  }
  else {
    if (newDatabase.name == currentDatabase.name) {
      nodes.value.forEach((node, index) => {
        if (node.type == NodeType.DATABASE && node.data.name == currentDatabase.name) {
          node.data.type = newDatabase.type
          node.data.url = newDatabase.url
        }
      });
      editDatabaseFromList(currentDatabase, newDatabase)
      ElMessage({
        message: '修改成功',
        type: 'success',
      })
    }
    else {
      const isExist = findDatabaseByName(newDatabase.name)
      if (isExist) {
        ElMessage({
          message: '修改失败，名称不能重复',
          type: 'error',
        })
        return
      }
      else {
        if (database.value == currentDatabase.name) {
          database.value = newDatabase.name
        }
        nodes.value.forEach((node, index) => {
          if (node.type == NodeType.DATABASE && node.data.name == currentDatabase.name) {
            node.data.name = newDatabase.name
            node.data.type = newDatabase.type
            node.data.url = newDatabase.url
          }
        });
        editDatabaseFromList(currentDatabase, newDatabase)
        ElMessage({
        message: '修改成功',
        type: 'success',
      })
      }
    }
    databaseFormVisible.value = false
  }
}

watch(isSave, (newValue, oldValue) => {
  if (oldValue === false && newValue === true) {
    var item = {
      name: '',
      type: '',
      url: '',
    }
    if (database.value != '') {
      item = findDatabaseByName(database.value)
    }
    updateNode(drawerClickNode.value.id,
      {
        data:
        {
          name: item.name,
          type: item.type,
          url: item.url,
          sqlCommand: sqlCommand.value
        }
      })
    saveAttributeComplete()
  }
})
</script>

<style scoped>
.form-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  gap: 20px;
}

.database-container {
  width: 100%;
  height: 160px;
  border-radius: 5px;
  border: 1px solid #dedfe0;
  display: flex;
  margin-top: 5px;
}

.database-span-container {
  width: 15%;
  height: 100%;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: flex;
}

.database-span {
  line-height: 100%;
  writing-mode: vertical-lr;
  letter-spacing: 0.5em;
  margin-top: 10px;
  font-weight: bold;
}

.database-right-container {
  width: 85%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scrollbar-container {
  margin-top: 10px;
  width: 100%;
  height: 110px;
}

.database-button-container {
  width: 100%;
  height: 30px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: flex;
  margin: 6px 0px 6px 0px;
}

.database-button {
  width: 95%;
  height: 30px;
  position: relative;
}

.database-button:hover {
  background-color: #c6e2ff;
}

.database-text {
  position: absolute;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 80%;
}

.delete-button {
  display: none;
  width: 20px;
  height: 30px;
  border-width: 0px;
  margin-left: 5px;
  margin-right: 15px;
}

.delete-button:hover {
  background-color: #fef0f0;
}

.database-button-container:hover .delete-button {
  display: flex;
}

.add-button-container {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: flex;
  width: 95%;
  height: 40px;
}

.add-button {
  cursor: pointer;
  border-color: #b1b3b8;
}

.divider {
  margin: 0px;
  width: 100%;
}

.form-item {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
}

.form-item label {
  font-size: 15px;
}

.input-field {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
