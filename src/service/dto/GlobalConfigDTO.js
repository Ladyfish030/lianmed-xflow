export function formatMySQL(config) {
    return {
        id: config.id,
        name: config.name,
        type: config.type,
        connection: config.connection,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        driver: config.driver,
    }
}

export function formatSQLServer(config) {
    return {
        id: config.id,
        name: config.name,
        type: config.type,
        connection: config.connection,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        instanceName: config.instanceName,
        database: config.database,
        driver: config.driver,
    }
}

export function formatOracle(config) {
    return {
        id: config.id,
        name: config.name,
        type: config.type,
        connection: config.connection,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        instanceName: config.instanceName,
        serviceName: config.serviceName,
        driver: config.driver,
    }
}

export function formatPostgreSQL(config) {
    return {
        id: config.id,
        name: config.name,
        type: config.type,
        connection: config.connection,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        driver: config.driver,
    }
}

export function formatListener(config) {
    return {
        id: config.id,
        name: config.name,
        type: config.type,
        protocol: config.protocol,
        host: config.host,
        port: config.port,
        basePath: config.basePath,
    }
}