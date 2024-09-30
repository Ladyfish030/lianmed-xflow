import { toJpeg as ElToJpg, toPng as ElToPng } from 'html-to-image'
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { useNodeStore } from '@/store/family_tree/nodeStore'

const nodeStore = useNodeStore()
export const isScreenshotClicked = ref(false)

export function useScreenshot() {
    const { fitView } = useVueFlow()

    const dataUrl = ref('')
    const imgType = ref('png')
    const error = ref()

    async function doScreenshot(element, options = {}) {
        // 自适应调整视图
        await fitView({ padding: 0.1, includeHiddenNodes: true, maxZoom: 1, minZoom: 0 })
        // 捕获截图
        await capture(element, options)
    }

    async function capture(el, options) {
        let data

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

    function download() {
        const fileName = `家系图截屏-${Date.now()}`
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
