<template>
    <div class="config-container">
        <el-table :data="paginatedData" v-loading="loading" height="460px" max-height="460px" ref="scrollbar">
            <el-table-column label="配置名" min-width="50%">
                <template #default="scope">
                    <div class="cell-content">
                        <el-text style="width: 100%;" truncated>
                            {{ scope.row.name }}
                        </el-text>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="类别" min-width="30%">
                <template #default="scope">
                    <div class="cell-content">
                        <el-text style="width: 100%;" truncated>
                            {{ scope.row.type }}
                        </el-text>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="20%">
                <template #default="scope">
                    <el-tooltip :hide-after="0" content="编辑" placement="bottom" effect="dark">
                        <button class="tool-button" @click="editConfigHandler(scope.row.name, scope.row.type)">
                            <el-icon size="15">
                                <Edit />
                            </el-icon>
                        </button>
                    </el-tooltip>

                    <el-tooltip :hide-after="0" content="删除" placement="bottom" effect="dark">
                        <button class="tool-button" @click="deleteConfigHandler(scope.row.id)">
                            <el-icon size="15" color="#f89898">
                                <Delete />
                            </el-icon>
                        </button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination 
            class="pagination-container"
            v-model:current-page="currentPage" 
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]" 
            layout="total, sizes, prev, pager, next, jumper" 
            :total="total" 
            @size-change="handlePageSizeChange" />
    </div>
    <DatabaseConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.DATABASE_CONFIG && configDialogVisible" />
    <ListenerConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.LISTENER_CONFIG && configDialogVisible" />
    <RequestConfigDialog
        v-if="selectedConfigType === GlobalConfigTypeInGeneral.REQUEST_CONFIG && configDialogVisible" />
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted, nextTick } from 'vue'
import {
    globalConfigList,
    configDialogVisible,
    currentConfigForm,
    temporaryConfigForm,
    isAddConfig,
} from '@/hooks/useGlobalConfig'
import {
    getGlobalConfigByName,
    getAllGlobalConfig,
    deleteGlobalConfig,
} from '@/service/GlobalConfigService'

import DatabaseConfigDialog from '@/components/DatabaseConfigDialog.vue'
import ListenerConfigDialog from '@/components/ListenerConfigDialog.vue'
import RequestConfigDialog from '@/components/RequestConfigDialog.vue'

import { GlobalConfigTypeInGeneral } from '@/enums/GlobalConfigTypeInGeneral'

const currentPage = ref(1)
const pageSize = ref(10)
const total = computed(() => {
    return globalConfigList.value.length
})
const loading = ref(true)

const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return globalConfigList.value.slice(start, end)
})

const selectedConfigType = ref(null)

async function fetchAllGlobalConfigs() {
    loading.value = true
    await getAllGlobalConfig()
        .then((res) => {
            globalConfigList.value = res.map(config => JSON.parse(config.globalJson));
        })
        .catch((error) => {
            ElMessage({
                type: 'error',
                message: '获取全局配置错误',
            })
        })
    loading.value = false
};

onBeforeMount(async () => {
    await fetchAllGlobalConfigs()
})

const scrollbar = ref(null);

onMounted(() => {
  nextTick(() => {
    const scrollbarView = scrollbar.value.$el.querySelector('.el-scrollbar__view');
    if (scrollbarView) {
        scrollbarView.style.display = 'flex';
        scrollbarView.style.flexDirection = 'column'
    }
  });
});

function handlePageSizeChange(size) {
    pageSize.value = size
}

async function editConfigHandler(name, type) {
    selectedConfigType.value = type
    Object.keys(currentConfigForm).forEach(key => {
        delete currentConfigForm[key]
    })
    Object.keys(temporaryConfigForm).forEach(key => {
        delete temporaryConfigForm[key]
    })
    await getGlobalConfigByName(name)
        .then((res) => {
            if (Object.keys(res).length !== 0) {
                const config = JSON.parse(res.jsonString)
                Object.assign(temporaryConfigForm, { ...config })
                Object.assign(currentConfigForm, { ...config })
            }
        })
        .catch((error) => {
            ElMessage({
                type: 'error',
                message: '获取全局配置错误',
            })
        })
    isAddConfig.value = false
    configDialogVisible.value = true
}

function deleteConfigHandler(id) {
    ElMessageBox.confirm('确定删除该配置？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    })
        .then(async () => {
            await deleteGlobalConfig(id)
                .then(async (res) => {
                    ElMessage({
                        message: '删除成功',
                        type: 'success',
                    });
                    await fetchAllGlobalConfigs();
                })
                .catch((error) => {
                    ElMessage({
                        type: 'error',
                        message: '删除失败',
                    });
                });
        })
        .catch(() => {

        })
}
</script>

<style scoped>
.config-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

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

.tool-button {
  margin-right: 5px;
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

.pagination-container {
    height: 40px;
    padding: 10px;
    margin: 0px;
    margin-bottom: 0px;
    margin-top: auto;
}

:deep(.el-pagination__total.is-first) {
    line-height: 1.5;
    display: flex;
}

:deep(.el-pagination__sizes) {
    line-height: 1.5;
    display: flex;
}

:deep(.el-pagination__jump.is-last) {
    line-height: 1.5;
    display: flex;
}
</style>