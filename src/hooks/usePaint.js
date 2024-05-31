import { useVueFlow } from '@vue-flow/core'
import { ref } from 'vue'
import { setGlobalConfig } from '../hooks/useGlobalConfig'
import { setParentPos, getParentPos } from '../hooks/useAdsorption.js'
const { toObject, fromObject } = useVueFlow()

let paintName = ''
let paintId = null
function setPaintName(name) {
  paintName = name
}
function getPaintName() {
  return paintName
}
function setPaintId(id) {
  paintId = Number(id)
}
function getPaintId() {
  return String(id)
}
function showCanvas(canvas) {
  console.log(canvas)
  setParentPos(canvas.parentPos)
  console.log(getParentPos())
  setGlobalConfig(canvas.globalConfig)
}
export { getPaintName, setPaintName, setPaintId, getPaintId, showCanvas }
