# src/hooks 目录说明

存放跨页面复用的 React 自定义 Hooks，如数据获取、窗口尺寸等。

## 使用约定
- Hook 命名遵循 `use*` 规则并附带 JSDoc 注释。
- 依赖特定 feature 的 Hook 应放入对应 feature 内。
- 与外部服务交互的 Hook 请在此记录依赖与错误处理方案。

## Hook 记录
- `useAuthBootstrap`: 在应用启动时触发 `fetchCurrentUser`，确保路由守卫可以依赖 `initialized` 状态。
