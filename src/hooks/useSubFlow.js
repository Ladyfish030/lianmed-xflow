import { ref } from 'vue'

const subFlowList = ref([])

function generateUniqueSubFlowName() {
    let baseName = "sub_flow";
    let index = 1;
    let newName = baseName;
    
    while (subFlowList.value.includes(newName)) {
        newName = baseName + "_" + index;
        index++;
    }
    
    subFlowList.value.push(newName)
    return newName;
}

function findSubFlow(subFlowName) {
    const index = subFlowList.value.indexOf(subFlowName);
    return index
}

function editSubFlow(oldName, newName) {
    const index = findSubFlow(oldName)
    if (index !== -1) {
        subFlowList.value[index] = newName;
    }
}

function deleteSubFlowByName(name) {
    subFlowList.value = subFlowList.value.filter((subFlow) => subFlow !== name)
}

export {
    subFlowList,
    generateUniqueSubFlowName,
    findSubFlow,
    editSubFlow,
    deleteSubFlowByName,
}