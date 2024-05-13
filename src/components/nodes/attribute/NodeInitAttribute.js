// 定义 Database 初始化属性
const Database = {
  id: '',
  type: '',
  data: {
    displayName: 'Database',
    operation: '',
    connectorConfiguration: '',
    sqlCommand: '',
    inputParameters: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 70,
    height: 70,
  },
  initDimensions: {
    width: 70,
    height: 70,
  },
  parentNode: '',
  adsorption: false,
}

// 定义 WebService 初始化属性
const WebService = {
  id: '',
  type: '',
  data: {
    path: '',
    method: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 70,
    height: 70,
  },
  initDimensions: {
    width: 70,
    height: 70,
  },
  parentNode: '',
  adsorption: false,
}

// 定义 条件分支 初始化属性
const Choice = {
  id: '',
  type: '',
  data: {
    displayName: 'Choice',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 180,
    height: 170,
  },
  initDimensions: {
    width: 180,
    height: 170,
  },
  parentNode: '',
  adsorption: false,
  defaultNode: '',
  childNodes: [],
}

// 定义 条件分支When 初始化属性
const ChoiceWhen = {
  id: '',
  type: '',
  data: {
    expression: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 110,
    height: 110,
  },
  initDimensions: {
    width: 110,
    height: 110,
  },
  parentNode: '',
  adsorption: true,
  childNodes: [],
}

// 定义 条件分支Default 初始化属性
const ChoiceDefault = {
  id: '',
  type: '',
  data: {},
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 110,
    height: 110,
  },
  initDimensions: {
    width: 110,
    height: 110,
  },
  parentNode: '',
  adsorption: true,
  childNodes: [],
}

// 定义 ForEach 初始化属性
const ForEach = {
  id: '',
  type: '',
  data: {
    displayName: 'ForEach',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 100,
    height: 100,
  },
  initDimensions: {
    width: 100,
    height: 100,
  },
  parentNode: '',
  adsorption: true,
  childNodes: [],
}

// 定义 Sub Flow 初始化属性
const SubFlow = {
  id: '',
  type: '',
  data: {
    displayName: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 150,
    height: 100,
  },
  initDimensions: {
    width: 150,
    height: 100,
  },
  parentNode: '',
  adsorption: true,
  childNodes: [],
}

// 定义 Logger 初始化属性
const Logger = {
  id: '',
  type: '',
  data: {
    displayName: 'Logger',
    message: '',
    level: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 70,
    height: 70,
  },
  initDimensions: {
    width: 70,
    height: 70,
  },
  parentNode: '',
  adsorption: false,
}

// 定义 Flow Reference 初始化属性
const FlowReference = {
  id: '',
  type: '',
  data: {
    displayName: 'Flow Reference',
    flowName: '',
  },
  position: {
    x: 0,
    y: 0,
  },
  dimensions: {
    width: 70,
    height: 70,
  },
  initDimensions: {
    width: 70,
    height: 70,
  },
  parentNode: '',
  adsorption: false,
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
