import { nodes } from '../../hooks/useNode'
import { globalConfigList } from '../../hooks/useGlobalConfig'

import * as ConfigDTO from './GlobalConfigDTO'
import * as NodeDTO from './NodeGenerateXmlDTO'

import { NodeType } from '../../enums/NodeType'
import { GlobalConfigTypeInGeneral } from '../../enums/GlobalConfigTypeInGeneral'
import { GlobalConfigTypeInDetail } from '../../enums/GlobalConfigTypeInDetail'

export function formatGenerateXmlData() {
    var result = {
        globalConfig: [],
        nodes: [],
    }

    const configMappings = {
        [GlobalConfigTypeInDetail.DATABASE_MYSQL_CONFIG]: ConfigDTO.formatMySQL,
        [GlobalConfigTypeInDetail.DATABASE_SQLSERVER_CONFIG]: ConfigDTO.formatSQLServer,
        [GlobalConfigTypeInDetail.DATABASE_ORACLE_CONFIG]: ConfigDTO.formatOracle,
        [GlobalConfigTypeInDetail.DATABASE_POSTGRESQL_CONFIG]: ConfigDTO.formatPostgreSQL,
        [GlobalConfigTypeInDetail.LISTENER_CONFIG]: ConfigDTO.formatListener,
        [GlobalConfigTypeInDetail.REQUEST_CONFIG]: ConfigDTO.formatRequest,
    }
    const nodeMappings = {
        [NodeType.FLOW]: NodeDTO.formatFlow,
        [NodeType.DATABASE]: NodeDTO.formatDatabase,
        [NodeType.LISTENER]:NodeDTO.formatListener,
        [NodeType.CHOICE]: NodeDTO.formatChoice,
        [NodeType.CHOICEWHEN]: NodeDTO.formatChoiceWhen,
        [NodeType.CHOICEDEFAULT]: NodeDTO.formatChoiceDefault,
        [NodeType.FOREACH]: NodeDTO.formatForEach,
        [NodeType.SUBFLOW]: NodeDTO.formatSubFlow,
        [NodeType.LOGGER]: NodeDTO.formatLogger,
        [NodeType.FLOWREFERENCE]: NodeDTO.formatFlowReference,
        [NodeType.SETPAYLOAD]: NodeDTO.formatSetPayload,
        [NodeType.REQUEST]: NodeDTO.formatRequest,
    }

    const configList = globalConfigList.value
    for (const config of configList) {
        var type = config.type
        if (type == GlobalConfigTypeInGeneral.DATABASE_CONFIG) {
            type = config.connection
        }

        if (configMappings.hasOwnProperty(type)) {
            const targetConfig = configMappings[type](config)
            result.globalConfig.push(targetConfig)
        }
    }

    const nodeList = nodes.value
    for (const node of nodeList) {
        const type = node.type
        if (nodeMappings.hasOwnProperty(type)) {
            const targetNode = nodeMappings[type](node)
            result.nodes.push(targetNode)
        }
    }

    return result
}