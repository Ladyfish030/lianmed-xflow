import { toJpeg as ElToJpg, toPng as ElToPng } from 'html-to-image'
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useNodeStore } from '@/store/family_tree/nodeStore'

const nodeStore = useNodeStore()
export const isScreenshotClicked = ref(false)

export function useScreenshot() {
    const { setViewport } = useVueFlow()

    const dataUrl = ref('')
    const imgType = ref('png')
    const error = ref()

    async function doScreenshot(element, options = {}) {
        // 自适应调整视图
        await fitViewToNodes()
        // 捕获截图
        await capture(element, options)
    }

    // 自适应地调整视图，使节点居中且填满画布
    async function fitViewToNodes() {
        // 获取节点的边界框
        const boundingBox = getBoundingBox(nodeStore.nodes)

        // 获取 Vue Flow 容器的宽高
        const viewportSize = getViewportSize()

        // 计算缩放比例，使节点正好填满画布
        const zoomX = viewportSize.width / boundingBox.width
        const zoomY = viewportSize.height / boundingBox.height
        // 选择最小的缩放比例，以确保所有节点都在画布中，最大缩放比例为1
        const zoom = Math.min(1, Math.min(zoomX, zoomY))

        // 计算中心位置，确保节点居中
        const centerX = boundingBox.minX + boundingBox.width / 2
        const centerY = boundingBox.minY + boundingBox.height / 2

        // 计算调整后的画布 x 和 y
        const newX = (viewportSize.width / 2 - centerX * zoom)
        const newY = (viewportSize.height / 2 - centerY * zoom)

        // 应用新的视图设置
        await setViewport({ x: newX, y: newY, zoom })
    }

    // 计算节点的边界框
    function getBoundingBox(nodes) {
        if (!nodes.length) return { minX: 0, minY: 0, maxX: 0, maxY: 0 }

        const xPositions = nodes.map(node => node.position.x)
        const yPositions = nodes.map(node => node.position.y)
        const nodeWidths = nodes.map(node => node.dimensions.width || 0)
        const nodeHeights = nodes.map(node => node.dimensions.height || 0)

        const minX = Math.min(...xPositions)
        const minY = Math.min(...yPositions)
        const maxX = Math.max(...xPositions.map((x, i) => x + nodeWidths[i]))
        const maxY = Math.max(...yPositions.map((y, i) => y + nodeHeights[i]))

        return {
            minX,
            minY,
            width: maxX - minX,
            height: maxY - minY,
        }
    }

    // 获取 Vue Flow 容器的尺寸
    function getViewportSize() {
        const vueFlowEl = document.querySelector('.vue-flow')
        return {
            width: vueFlowEl.clientWidth,
            height: vueFlowEl.clientHeight,
        }
    }

    async function capture(el, options) {
        let data

        const fileName = options.fileName || `家系图截屏-${Date.now()}`

        switch (options.type) {
            case 'jpeg':
                data = await toJpeg(el, options)
                break
            case 'png':
                data = await toPng(el, options)
                break
            default:
                data = await toPng(el, options)
                break
        }

        // immediately download the image if shouldDownload is true
        if (options.shouldDownload && fileName !== '') {
            download(fileName)
        }

        isScreenshotClicked.value = false
        return data
    }

    async function toJpeg(el, options = { quality: 0.95 }) {
        error.value = null

        return ElToJpg(el, options)
            .then((data) => {
                dataUrl.value = data
                imgType.value = 'jpeg'
                return data
            })
            .catch((err) => {
                error.value = err
                throw new Error(err)
            })
    }

    async function toPng(el, options = { quality: 0.95 }) {
        error.value = null

        return ElToPng(el, options)
            .then((data) => {
                dataUrl.value = data
                imgType.value = 'png'
                return data
            })
            .catch((err) => {
                error.value = err
                throw new Error(err)
            })
    }

    function download(fileName) {
        const link = document.createElement('a')
        link.download = `${fileName}.${imgType.value}`
        link.href = dataUrl.value
        link.click()
    }
    
    return {
        doScreenshot,
        capture,
        download,
        dataUrl,
        error,
    }
}
