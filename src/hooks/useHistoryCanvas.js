import { ref } from 'vue'
import { setGlobalConfig } from './useGlobalConfig.js'
import { setParentPos, getParentPos } from './useAdsorption.js'

let paintName = ''
let paintId = ''
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
  return String(paintId)
}
function showCanvas(canvas) {
  console.log(canvas)
  setParentPos(canvas.parentPos)
  console.log(getParentPos())
  setGlobalConfig(canvas.globalConfig)
}
export {
  getPaintName,
  setPaintName,
  setPaintId,
  getPaintId,
  showCanvas,
}
