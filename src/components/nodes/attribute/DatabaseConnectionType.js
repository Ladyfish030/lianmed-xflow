import { GlobalConfigTypeInDetail } from '@/enums/GlobalConfigTypeInDetail'

export const DatabaseConnectionType = {
    MYSQL_CONNECTION: GlobalConfigTypeInDetail.DATABASE_MYSQL_CONFIG,
    SQLSERVER_CONNECTION: GlobalConfigTypeInDetail.DATABASE_SQLSERVER_CONFIG,
    ORACLE_CONNECTION: GlobalConfigTypeInDetail.DATABASE_ORACLE_CONFIG,
    POSTGRESQL_CONNECTION: GlobalConfigTypeInDetail.DATABASE_POSTGRESQL_CONFIG,
}