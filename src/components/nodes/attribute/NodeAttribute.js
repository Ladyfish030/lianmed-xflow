// 定义 Database 数据结构
const Database = {
  id: '',
  type: '',
  data: {
    name: '',
    type: '',
    url: '',
    sqlCommand: ''
  },
  position: {
    x: 0,
    y: 0
  },
  parentNode: '',
  expandParent:true
};

// 定义 WebService 数据结构
const WebService = {
  id: '',
  type: '',
  data: {
    path: '',
    method: ''
  },
  position: {
    x: 0,
    y: 0
  },
  parentNode: '',
  expandParent:true
};

// 定义 条件分支 数据结构
const ConditionalBranch = {
  id: '',
  type: '',
  condition: '',
  position: {
    x: 0,
    y: 0
  },
  parentNode: '',
  expandParent:true
};

export { Database, WebService, ConditionalBranch };