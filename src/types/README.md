# src/types 目录说明

定义全局共享的 TypeScript 类型、接口和枚举。

## 使用约定
- 对外暴露的类型在 `index.ts` 聚合导出。
- 与具体 feature 相关的类型应放在 feature 内部并在需要时导出。
- 更新类型时同步记录来源（API、数据库等）。

## 类型记录
- `index.ts`: 聚合导出入口。
- TODO: 记录其他类型文件。
