# src/stores 目录说明

集中管理全局状态（Zustand/Redux 等），定义 store、slice 以及相关中间件。

## 使用约定
- 每个 store 单独一个文件或目录，并在此记录作用域。
- 状态变更需具备可追踪性，必要时补充 devtools 配置。
- 涉及持久化或跨标签页同步时，在此说明策略。

## Store 记录
- TODO: 列出已实现 store 及其状态结构。
