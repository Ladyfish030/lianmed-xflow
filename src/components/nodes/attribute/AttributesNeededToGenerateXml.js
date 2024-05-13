const Database = {
  id: '',
  type: '',
  data: {
    displayName: '',
    operation: '',
    connectorConfiguration: '',
    sqlCommand: '',
    inputParameters: '',
  },
  parentNode: '',
}

const WebService = {
  id: '',
  type: '',
  data: {
    path: '',
    method: '',
  },
  parentNode: '',
}

const Choice = {
  id: '',
  type: '',
  data: {
    displayName: '',
  },
  parentNode: '',
  defaultNode: '',
  childNodes: [],
}

const ChoiceWhen = {
  id: '',
  type: '',
  data: {
    expression: '',
  },
  parentNode: '',
  childNodes: [],
}

const ChoiceDefault = {
  id: '',
  type: '',
  data: {},
  parentNode: '',
  childNodes: [],
}

const ForEach = {
  id: '',
  type: '',
  data: {
    displayName: '',
  },
  parentNode: '',
  childNodes: [],
}

const SubFlow = {
  id: '',
  type: '',
  data: {
    displayName: '',
  },
  parentNode: '',
  childNodes: [],
}

const Logger = {
  id: '',
  type: '',
  data: {
    displayName: '',
    message: '',
    level: '',
  },
  parentNode: '',
}

const FlowReference = {
  id: '',
  type: '',
  data: {
    displayName: '',
    flowName: '',
  },
  parentNode: '',
}

export {
  Database,
  WebService,
  Choice,
  ChoiceWhen,
  ChoiceDefault,
  ForEach,
  SubFlow,
  Logger,
  FlowReference,
}
