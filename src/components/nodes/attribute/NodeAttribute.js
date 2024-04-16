// 定义 Database 数据结构
const Database = {
  id: '',
  type: '',
  data: {
    name: '',
    type: '',
    url: '',
    sqlCommand: '',
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

// 定义 WebService 数据结构
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

// 定义 条件分支 数据结构
const Choice = {
  id: '',
  type: '',
  data: '',
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
}

// 定义 条件分支When 数据结构
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

// 定义 条件分支Default 数据结构
const ChoiceDefault = {
  id: '',
  type: '',
  data: '',
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

// 定义 ForEach 数据结构
const ForEach = {
  id: '',
  type: '',
  data: '',
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

// 定义 Sub Flow 数据结构
const SubFlow = {
  id: '',
  type: '',
  data: {
    name: '',
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

export {
  Database,
  WebService,
  Choice,
  ChoiceWhen,
  ChoiceDefault,
  ForEach,
  SubFlow,
}
