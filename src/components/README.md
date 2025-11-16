# src/components 目录说明

存放可在全局复用的 Presentational 组件，按 common 与 layout 分类。

## 使用约定
- 组件必须是无副作用的纯 UI，复杂业务请放在 feature 目录。
- 导出的组件需要配备 Story/示例或在 README 记录用途。
- 保持 common 组件的 API 稳定，并在变量命名中体现语义。

## 子目录
- `common/`: 按钮、输入框等基础 UI 元素。
- `layout/`: Header、Footer、Sidebar 等布局结构。

## 变更记录
- TODO: 记录新增/重构组件。
