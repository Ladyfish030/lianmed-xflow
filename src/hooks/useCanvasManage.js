import { ref, nextTick } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { getParentPos, setParentPos } from './useAdsorption'
import { getGlobalConfig, setGlobalConfig } from './useGlobalConfig'
import { getFlowList, setFlowList } from '@/hooks/useNodeOfFlow'
import { findNodeById, getNodeId } from './useNode'
const state = {
  canvasList: ref([]),
  currentCanvasIndex: ref(-1),
  historyCanvasList: ref([]),
  isShowEditFlag: ref(false),
}

export default function useCanvasManage() {
  const { canvasList, currentCanvasIndex, historyCanvasList, isShowEditFlag } =
    state
  const { toObject, fromObject } = useVueFlow()

  function generateCanvasName() {
    let baseName = '新建业务流'
    let index = 1
    let newName = baseName + `${index}`

    while (canvasList.value.some((item) => item.name === newName)) {
      index++
      newName = baseName + `${index}`
    }

    return newName
  }

  function initPaint() {
    const paint = {
      edges: [],
      nodes: [],
      position: [0, 0],
      viewport: { x: 0, y: 0, zoom: 1 },
      zoom: 1,
    }
    return paint
  }

  async function createNewCanvas() {
    isShowEditFlag.value = true
    const name = generateCanvasName()
    const paint = initPaint()
    var newCanvas = {
      name: name,
      paint: paint,
      flowList: [],
      parentPos: [],
      globalConfig: [],
      isEdited: true,
    }
    //更新nodes
    canvasList.value.push(newCanvas)
    await switchCanvas(canvasList.value.length - 1)

    findNodeById(1)
  }

  function importCanvas(canvas) {
    isShowEditFlag.value = false
    const newCanvas = {
      id: canvas.id,
      name: canvas.name,
      paint: canvas.paint,
      flowList: canvas.flowList,
      parentPos: canvas.parentPos,
      globalConfig: canvas.globalConfig,
      isEdited: false,
    }
    canvasList.value.push(newCanvas)
    switchCanvas(canvasList.value.length - 1)
    setTimeout(() => {
      isShowEditFlag.value = true
    }, 100)
  }

  function getCurrentCanvas() {
    if (
      currentCanvasIndex.value < 0 ||
      currentCanvasIndex.value >= canvasList.value.length
    ) {
      return null
    }
    const canvas = canvasList.value[currentCanvasIndex.value]
    return canvas
  }

  function getCanvasIndexById(id) {
    const index = canvasList.value.findIndex((item) => item.id === id)
    return index
  }

  function getCanvasByIndex(index) {
    if (index < 0 || index >= canvasList.value.length) {
      return null
    } else {
      const canvas = canvasList.value[index]
      return canvas
    }
  }

  function getCanvasById(id) {
    const canvas = canvasList.value.find((canvas) => canvas.id === id)
    return canvas === undefined ? null : canvas
  }

  async function switchCanvas(index) {
    if (
      index < 0 ||
      index >= canvasList.value.length ||
      index === currentCanvasIndex.value
    ) {
      return
    }
    if (canvasList.value.length > 1) {
      // 先保存旧画布的数据
      var currentCanvas = getCurrentCanvas()
      currentCanvas.paint = toObject()
      currentCanvas.parentPos = getParentPos()
      currentCanvas.globalConfig = getGlobalConfig()
      currentCanvas.flowList = getFlowList()
    }

    // 切换到新的画布
    currentCanvasIndex.value = index
    const nextCanvas = getCurrentCanvas()
    setParentPos(nextCanvas.parentPos)
    setGlobalConfig(nextCanvas.globalConfig)
    setFlowList(nextCanvas.flowList)
    await fromObject(nextCanvas.paint)
  }

  function deleteCanvasByIndex(index) {
    isShowEditFlag.value = false
    if (index < 0 || index >= canvasList.value.length) {
      return
    }
    canvasList.value.splice(index, 1)

    if (canvasList.value.length === 0) {
      currentCanvasIndex.value = -1
    } else {
      if (index === currentCanvasIndex.value) {
        if (index <= canvasList.value.length - 1) {
          currentCanvasIndex.value = index
        } else {
          currentCanvasIndex.value = canvasList.value.length - 1
        }
      } else if (index < currentCanvasIndex.value) {
        currentCanvasIndex.value = Math.max(0, currentCanvasIndex.value - 1)
      }
      const nextCanvas = getCurrentCanvas()
      setParentPos(nextCanvas.parentPos)
      setGlobalConfig(nextCanvas.globalConfig)
      setFlowList(nextCanvas.flowList)
      console.log(JSON.stringify(nextCanvas.paint))
      fromObject(nextCanvas.paint)
    }
    setTimeout(() => {
      isShowEditFlag.value = true
    }, 100)
  }

  return {
    canvasList,
    currentCanvasIndex,
    historyCanvasList,
    isShowEditFlag,
    createNewCanvas,
    importCanvas,
    getCurrentCanvas,
    getCanvasIndexById,
    getCanvasByIndex,
    getCanvasById,
    switchCanvas,
    deleteCanvasByIndex,
  }
}
