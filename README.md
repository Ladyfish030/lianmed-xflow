# 家系图模块说明

本说明文档梳理了本项目中所有与家系图功能相关的主要文件及其作用。



## 技术栈说明

- **Vue 3**：本项目基于 Vue 3 进行开发。
- **Vue Flow**：家系图的可视化与节点拖拽、连线等功能基于 [Vue Flow](https://vueflow.dev/) 实现。
- **Element Plus**：UI 组件库。
- **Node.js**：建议使用 Node.js 16.x 或 18.x 版本进行开发和运行。



## 目录结构

```
src/
├── assets/
│   └── svg/
│       └── family_tree/
│           ├── AddBrotherIcon.vue
│           ├── AddDaughterIcon.vue
│           ├── AddMateIcon.vue
│           ├── AddParentsIcon.vue
│           ├── AddSisterIcon.vue
│           ├── AddSonIcon.vue
│           └── ...（其他家系图相关SVG图标）
├── components/
│   └── family_tree/
│       ├── nodes/
│       │   ├── attribute/
│       │   │   └── NodeInitAttribute.js
│       │   │── menu/
│       │   │   └── NodeContextMenu.vue
│       │   └── FamilyTreeNode.vue
│       ├── FamilyTreeHeader.vue
│       ├── FamilyTreeMain.vue
│       └── NodeInformationDrawer.vue
├── enums/
│   └── family_tree/
│       ├── FamilyTreeNodeTypeEnum.ts
│       └── NodeAdjustPositionConstantEnum.js
├── hooks/
│   └── family_tree/
│       ├── useAdjustPosition.js
│       ├── useDrawer.js
│       ├── useEdge.js  
│       ├── useMenu.js
│       ├── useScreenshot.js
├── store/
│   └── family_tree/
│       └── nodeStore.js
├── utils/
│   └── arabicToRoman.js
├── views/
│   └── FamilyTree.vue
```



## 文件/文件夹说明

### `src/assets/svg/family_tree/`

- 存放所有家系图相关的 SVG 图标组件，如添加父母、兄弟、姐妹、儿子、女儿、配偶、导出图片、疾病标记、性别标记、死亡标记等。  
  这些图标用于家系图的节点、菜单、工具栏等视觉展示，便于用户识别和操作。

### `src/components/family_tree/`

- 存放家系图相关的 Vue 组件，如节点组件、节点菜单组件等。  
  这些组件负责家系图的具体 UI 展示和用户交互，是家系图功能的具体实现部分。

- **nodes/**  
  家系图节点相关组件目录。

  - **attribute/NodeInitAttribute.js**  
    定义家系图节点的初始化属性，包括节点的默认数据结构、初始状态等，供节点创建时引用。

  - **menu/NodeContextMenu.vue**  
    家系图节点的右键菜单组件。用于展示节点操作菜单（如添加父母、兄弟、姐妹、配偶、删除等），并处理菜单项的点击事件。

  - **FamilyTreeNode.vue**  
    家系图中单个节点的渲染组件。负责节点的显示、样式、交互（如点击、拖拽、选中等），并根据节点属性展示不同的图标和信息。

- **FamilyTreeHeader.vue**  
  家系图页面的头部组件。通常用于展示家系图的标题、导航、全局操作按钮等。

- **FamilyTreeMain.vue**  
  家系图的主视图区组件。负责家系图整体的布局、节点和连线的展示，是家系图的核心可视化区域。

- **NodeInformationDrawer.vue**  
  节点信息抽屉组件。用于在侧边栏展示和编辑当前选中节点的详细信息，如姓名、性别、疾病状态等。

### `src/enums/family_tree/`

- **NodeAdjustPositionConstantEnum.js**  
  家系图节点位置调整相关的常量枚举。用于统一管理节点间距、偏移量等参数。

- **FamilyTreeNodeTypeEnum.ts**  
  家系图节点类型的枚举定义，区分不同类型的节点。

### `src/hooks/family_tree/`

- **useMenu.js**  
  家系图节点菜单相关逻辑。包含右键菜单显示、节点的增删（父母、配偶、兄弟姐妹、子女）、节点删除的级联处理等功能。

- **useEdge.js**  
  家系图中节点之间连线的相关操作方法。用于添加、删除节点间的连线。

- **useAdjustPosition.js**  
  家系图节点位置调整相关逻辑。用于在添加/删除节点后自动调整节点的坐标，保证家系图结构的整齐和美观。

- **useDrawer.js**  
  控制节点信息抽屉（侧边栏）的显示与隐藏，以及当前选中节点的信息展示。

- **useScreenshot.js**  
  家系图截图导出相关逻辑。支持将家系图导出为 PNG/JPEG 图片，并提供下载功能。

### `src/store/family_tree/`

- **nodeStore.js**  
  家系图节点数据的状态管理。负责节点的增删查改、节点关系的维护、节点查找与排序等核心数据操作。

### `src/views/FamilyTree.vue`

- 家系图主页面组件。负责家系图的整体展示、交互入口、与各 hooks/store 的集成。

### `src/utils/arabicToRoman.js`

- 提供阿拉伯数字转罗马数字的工具函数。

  用于家系图节点编号、代数等场景，将数字如 1、2、3 转换为 I、II、III 等罗马数字格式。

## 适用范围

本模块适用于需要展示和编辑家族谱系结构的业务场景，如医学遗传家系分析、家族关系可视化等。



## 维护说明

- 所有节点操作均应通过 `nodeStore` 进行，避免直接操作节点数组。
- 节点的增删应配合位置调整和连线操作，保证家系图结构正确。
- 截图、导出等功能建议在数据渲染完成后使用。
- 图标和组件应按功能分类存放，便于维护和复用。