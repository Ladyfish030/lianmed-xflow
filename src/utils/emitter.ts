import mitt from 'mitt'
const emitter = mitt()
emitter.on('addWhenNode', () => {})
export default emitter
