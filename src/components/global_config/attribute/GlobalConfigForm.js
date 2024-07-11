import { DatabaseConnectionType } from '@/components/flow/nodes/attribute/DatabaseConnectionType'

const MySqlConfig = {
    name: '',
    connection: DatabaseConnectionType.MYSQL_CONNECTION,
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    driver: '',
}

const SqlServerConfig = {
    name: '',
    connection: DatabaseConnectionType.SQLSERVER_CONNECTION,
    host: '',
    port: '',
    username: '',
    password: '',
    instanceName: '',
    database: '',
    driver: '',
}

const OracleConfig = {
    name: '',
    connection: DatabaseConnectionType.ORACLE_CONNECTION,
    host: '',
    port: '',
    username: '',
    password: '',
    instanceName: '',
    serviceName: '',
    driver: '',
}

const PostgreSqlConfig = {
    name: '',
    connection: DatabaseConnectionType.POSTGRESQL_CONNECTION,
    host: '',
    port: '',
    username: '',
    password: '',
    database: '',
    driver: '',
}

const ListenerConfig = {
    name: '',
    protocol: 'HTTP',
    host: '',
    port: '',
    basePath: '',
}

const RequestConfig = {
    name: '',
    basePath: '',
    protocol: 'HTTP',
    host: '',
    port: '',
    connectionIdleTimeout: '30000',
}

export {
    MySqlConfig,
    SqlServerConfig,
    OracleConfig,
    PostgreSqlConfig,
    ListenerConfig,
    RequestConfig,
}