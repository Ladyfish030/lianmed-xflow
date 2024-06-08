import { ref } from 'vue'

const flowList = ref([])

function generateUniqueFlowName() {
    let baseName = "flow";
    let index = 1;
    let newName = baseName;
    
    while (flowList.value.includes(newName)) {
        newName = baseName + "_" + index;
        index++;
    }
    
    flowList.value.push(newName)
    return newName;
}

function findFlow(flowName) {
    const index = flowList.value.indexOf(flowName);
    return index
}

function editFlow(oldName, newName) {
    const index = findFlow(oldName)
    if (index !== -1) {
        flowList.value[index] = newName;
    }
}

function deleteFlowByName(name) {
    flowList.value = flowList.value.filter((subFlow) => subFlow !== name)
}

export {
    flowList,
    generateUniqueFlowName,
    findFlow,
    editFlow,
    deleteFlowByName,
}