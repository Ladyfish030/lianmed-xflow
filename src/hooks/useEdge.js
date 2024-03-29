import { ref, reactive } from 'vue'
import { NodeType } from '../enums/NodeType'

function edgeUpdate(e) {
  if (
    e[0] &&
    e[0].item &&
    e[0].item.sourceNode.type == NodeType.CONDITIONALBRANCH
  ) {
    e[0].item.label = 'Y'
    e[0].item.labelBgPadding = [8, 4]
    e[0].item.labelBgBorderRadius = 4
    e[0].item.labelBgStyle = { fill: '#FFCC00', color: '#fff' }
  }
}
function edgeClick(e) {
  if (e.edge.label == 'Y') {
    e.edge.label = 'N'
  } else if (e.edge.label == 'N') e.edge.label = 'Y'
}
export { edgeUpdate, edgeClick }
