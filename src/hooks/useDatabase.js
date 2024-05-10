import { ref } from 'vue'
import { nodes } from '../hooks/useNode'
import { NodeType } from '../enums/NodeType'

const databaseList = ref([])

function findDatabaseByName(databaseName) {
    const database = databaseList.value.find(database => database.name === databaseName)
    return database
}

function editDatabaseFromList(oldDatabase, newDatabase) {
    var database = findDatabaseByName(oldDatabase.name)
    database.name = newDatabase.name
    database.url = newDatabase.url
    database.type = newDatabase.type
}

function insertDatabaseToList(newDatabase) {
    const isExist = findDatabaseByName(newDatabase.name)
    if (isExist) {
        return false
    }
    else {
        databaseList.value.push(newDatabase)
        return true
    }
}

function removeDatabaseFromList(databaseName) {
    databaseList.value = databaseList.value.filter((database) => database.name !== databaseName)
}

export {
    databaseList,
    findDatabaseByName,
    insertDatabaseToList,
    removeDatabaseFromList,
    editDatabaseFromList,
}