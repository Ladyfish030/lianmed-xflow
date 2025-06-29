// 定义家系图节点的初始化属性对象
const initFamilyTreeNode = {
    id: '',            // 节点唯一标识
    type: '',          // 节点类型（见枚举 FamilyTreeNodeTypeEnum）
    data: {
        name: '',                              // 成员姓名
        generation: 1,                         // 所在代数（第几代）
        horizontalPosition: 1,                 // 本代中的水平位置（从左到右第几个）
        medicalCardNumber: '',                 // 就诊卡号或住院号
        sex: 0,                                // 性别：0-女性，1-男性，2-未知
        diseaseConditions: 0,                  // 疾病情况：0-正常，1-患病，2-携带者，3-未知
        status: 0,                             // 存活状态：0-存活，1-死亡
        dateOfBirth: '',                       // 出生日期
        dateOfDeath: '',                       // 死亡日期
        isProband: false,                      // 是否为先证者
        isGeneticOrMedicalExamination: false,  // 是否进行遗传学/医学检查
        annotation: '',                        // 备注信息
    },
    fatherId: '',         // 父亲节点id
    motherId: '',         // 母亲节点id
    mateId: '',           // 配偶节点id
    leftSiblingId: '',    // 左侧兄弟姐妹节点id
    rightSiblingId: '',   // 右侧兄弟姐妹节点id
    childrenId: [],       // 孩子节点id数组
    position: {
        x: 0,             // 节点在画布上的x坐标
        y: 0,             // 节点在画布上的y坐标
    },
    draggable: false,     // 节点是否可拖拽
    dimensions: {
        width: 50,        // 节点宽度
        height: 50,       // 节点高度
    },
}

export {
    initFamilyTreeNode
}