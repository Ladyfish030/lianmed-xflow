<template>
  <Panel class="save-restore-controls">
    <button style="background-color: #33a6b8" @click="onSave">保存草稿</button>
    <button style="background-color: #113285" @click="onRestore">
      载入草稿
    </button>
    <button style="background-color: #f89898" @click="onClear">
      清空草稿
    </button>
  </Panel>
</template>

<script setup>
import { Panel, useVueFlow } from '@vue-flow/core'
import { setParentPos, getParentPos } from '../hooks/useAdsorption'
import { getCopyIdRestore, setCopyIdRestore } from '../hooks/useMenu'
import useDragAndDrop from '../hooks/useDnD'
const { getIdRestore, setIdRestore } = useDragAndDrop()
const flowKey = 'xFlow'
const parentPos = 'parentPos'
const { toObject, fromObject } = useVueFlow()

function onSave() {
  localStorage.setItem(flowKey, JSON.stringify(toObject()))
  localStorage.setItem(parentPos, JSON.stringify(getParentPos()))
  localStorage.setItem('nodeId', getIdRestore())
  localStorage.setItem('copyNodeId', getCopyIdRestore())
  ElMessage({
    message: '保存成功',
    type: 'success',
  })
}

function onRestore() {
  const flow = JSON.parse(localStorage.getItem(flowKey))

  if (flow) {
    fromObject(flow)
    setParentPos(JSON.parse(localStorage.getItem(parentPos)))
    setIdRestore(parseInt(localStorage.getItem('nodeId')))
    setCopyIdRestore(parseInt(localStorage.getItem('copyNodeId')))
    ElMessage({
      message: '载入草稿成功',
      type: 'success',
    })
    return
  }

  ElMessage({
    message: '草稿箱为空',
    type: 'warning',
  })
}

function onClear() {
  localStorage.clear()
  ElMessage({
      message: '清空草稿成功',
      type: 'success',
  })
}
</script>

<style scoped>
.save-restore-controls {
  font-size: 14px;
  line-height: 30px;
  right: 60px;
  top: 0;
}

.save-restore-controls button {
  margin-left: 5px;
  padding: 10px;
  border-radius: 5px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 10px #0000004d;
  cursor: pointer;
}

.save-restore-controls button:hover {
  transform: scale(105%);
  transition: 0.25s all ease-in-out;
}
</style>
