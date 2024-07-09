export function formatFlow(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
        },
        childNodes: config.childNodes,
    }
}

export function formatDatabase(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            operation: config.data.operation,
            connectorConfiguration: config.data.connectorConfiguration,
            sqlCommand: config.data.sqlCommand,
            inputParameters: config.data.inputParameters,
        },
        parentNode: config.parentNode,
    }
}

export function formatListener(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            connectorConfiguration: config.data.connectorConfiguration,
            path: config.data.path,
        },
        parentNode: config.parentNode,
    }
}

export function formatRequest(config) {
    let headers = config.data.headers
    let queryParameters = config.data.queryParameters
    let urlParameters = config.data.urlParameters

    if (headers.length !== 0) {
        let obj = headers.reduce((result, header) => {
            result[header.key] = header.value
            return result
        }, {})
        
        headers =  JSON.stringify(obj, null, "\t")
    }
    if (queryParameters.length !== 0) {
        let obj = queryParameters.reduce((result, queryParameter) => {
            result[queryParameter.key] = queryParameter.value
            return result
        }, {})
        
        queryParameters =  JSON.stringify(obj, null, "\t")
    }
    if (urlParameters.length !== 0) {
        let obj = urlParameters.reduce((result, urlParameter) => {
            result[urlParameter.key] = urlParameter.value
            return result
        }, {})
        
        urlParameters =  JSON.stringify(obj, null, "\t")
    }

    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            connectorConfiguration: config.data.connectorConfiguration,
            method: config.data.method,
            path: config.data.path,
            url: config.data.url,
            body: config.data.body,
            headers: headers,
            queryParameters: queryParameters,
            urlParameters: urlParameters,
        },
        parentNode: config.parentNode,
    }
}

export function formatChoice(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
        },
        parentNode: config.parentNode,
        defaultNode: config.defaultNode,
        childNodes: config.childNodes,
    }
}

export function formatChoiceWhen(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            expression: config.data.expression,
        },
        parentNode: config.parentNode,
        childNodes: config.childNodes,
    }
}

export function formatChoiceDefault(config) {
    return {
        id: config.id,
        type: config.type,
        data: config.data,
        parentNode: config.parentNode,
        childNodes: config.childNodes,
    }
}

export function formatForEach(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
        },
        parentNode: config.parentNode,
        childNodes: config.childNodes,
    }
}

export function formatSubFlow(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
        },
        childNodes: config.childNodes,
    }
}

export function formatLogger(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            message: config.data.message,
            level: config.data.level,
        },
        parentNode: config.parentNode,
    }
}

export function formatFlowReference(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            flowName: config.data.flowName,
        },
        parentNode: config.parentNode,
    }
}

export function formatSetPayload(config) {
    return {
        id: config.id,
        type: config.type,
        data: {
            displayName: config.data.displayName,
            payloadValue: config.data.payloadValue,
        },
        parentNode: config.parentNode,
    }
}