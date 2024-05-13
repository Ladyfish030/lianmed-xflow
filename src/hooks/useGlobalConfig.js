import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

const globalConfigList = ref([])

function getGlobalConfigId() {
    const configId = uuidv4();
    return configId
}

function findGlobalConfigByName(configName) {
    const config = globalConfigList.value.find(config => config.name === configName)
    return config
}

function getGlobalConfigListByType(configType) {
    var configList = []
    globalConfigList.value.forEach((config, index) => {
        if (config.type == configType) {
            configList.push(config)
        }
    });
    return configList
}

function editGlobalConfig(oldConfig, newConfig) {
    var config = findGlobalConfigByName(oldConfig.name)

    for (let key in newConfig) {
        if (config.hasOwnProperty(key)) {
            config[key] = newConfig[key];
        }
    }

}

function insertGlobalConfig(newConfig) {
    const isExist = findGlobalConfigByName(newConfig.name)
    if (isExist) {
        return false
    }
    else {
        newConfig.id = getGlobalConfigId()
        globalConfigList.value.push(newConfig)
        return true
    }
}

function removeGlobalConfig(configName) {
    globalConfigList.value = globalConfigList.value.filter((config) => config.name !== configName)
}

export {
    globalConfigList,
    findGlobalConfigByName,
    getGlobalConfigListByType,
    editGlobalConfig,
    insertGlobalConfig,
    removeGlobalConfig,
}