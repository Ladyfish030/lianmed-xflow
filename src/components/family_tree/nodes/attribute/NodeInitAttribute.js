// 定义 initFamilyTreeNode 初始化属性
const initFamilyTreeNode = {
    id: '',                                    // 节点id
    type: '',                                  // 节点类型
    data: {
        name: '',                              // 姓名
        generation: 1,                         // 表示在家系图中位于第几代
        horizontalPosition: 1,                 // 表示在家系图中位于某一代从左往右第几个位置
        medicalCardNumber: '',                 // 就诊卡号（住院号）
        sex: 0,                                // 性别，0表示女性，1表示男性，2表示未知
        diseaseConditions: 0,                  // 疾病情况，0表示正常，1表示患病，2表示携带者
        status: 0,                             // 状态，0表示存活，1表示死亡
        dateOfBirth: '',                       // 出生日期
        dateOfDeath: '',                       // 死亡日期
        isProband: false,                      // 是否为先证者
        isGeneticOrMedicalExamination: false,  // 是否进行遗传学检查/临床检查
        annotation: '',                        // 注释
    },
    fatherId: '',                              // 父亲id
    motherId: '',                              // 母亲id
    mateId: '',                                // 配偶id
    leftSiblingId: '',                         // 左兄弟姐妹id
    rightSiblingId: '',                        // 右兄弟姐妹id
    childrenId: [],                            // 孩子id
    position: {
        x: 0,
        y: 0,
    },
    draggable: false,
    dimensions: {
        width: 50,
        height: 50,
    },
}

export {
    initFamilyTreeNode
}
