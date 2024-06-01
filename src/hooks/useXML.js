function turnXmlNode(nodes) {
  let arr = []
  for (let node of nodes) {
    let obj = {}
    for (let property of Object.keys(node)) {
      if (
        property == 'id' ||
        property == 'type' ||
        property == 'data' ||
        property == 'parentNode' ||
        property == 'childNodes' ||
        property == 'defaultNode'
      ) {
        obj[property] = node[property]
      }
    }
    arr.push(obj)
  }
  return arr
}
function turnXmlEdge(edges) {
  let arr = []
  for (let edge of edges) {
    let obj = {}
    for (let property of Object.keys(edge)) {
      if (property == 'id' || property == 'source' || property == 'target') {
        obj[property] = node[property]
      }
    }
    arr.push(obj)
  }
  return arr
}
export { turnXmlNode, turnXmlEdge }
