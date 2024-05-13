import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const databaseConfigList = ref([])

function getDatabaseConfigId() {
    const configId = uuidv4();
    return configId
}

function findDatabaseConfigByName(databaseConfigName) {
    const databaseConfig = databaseConfigList.value.find(databaseConfig => databaseConfig.name === databaseConfigName)
    return databaseConfig
}

function editDatabaseConfig(oldDatabaseConfig, newDatabaseConfig) {
    var databaseConfig = findDatabaseConfigByName(oldDatabaseConfig.name)
    for (let key in newDatabaseConfig) {
        if (databaseConfig.hasOwnProperty(key)) {
            databaseConfig[key] = newDatabaseConfig[key];
        }
    }
}

function insertDatabaseConfig(newDatabaseConfig) {
    const isExist = findDatabaseConfigByName(newDatabaseConfig.name)
    if (isExist) {
        return false
    }
    else {
        newDatabaseConfig.id = getDatabaseConfigId()
        databaseConfigList.value.push(newDatabaseConfig)
        return true
    }
}

function removeDatabaseConfig(databaseConfigName) {
    databaseConfigList.value = databaseConfigList.value.filter((databaseConfig) => databaseConfig.name !== databaseConfigName)
}

export {
    databaseConfigList,
    findDatabaseConfigByName,
    insertDatabaseConfig,
    removeDatabaseConfig,
    editDatabaseConfig,
}