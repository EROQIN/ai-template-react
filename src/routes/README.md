# src/routes 目录说明

维护前端路由配置，集中管理路由与页面组件的映射关系。

## 使用约定
- 默认导出 `createRouter` 或 `AppRoutes`，供 `App.tsx` 挂载。
- 所有页面路径需在此登记，便于 AI 协作者了解导航结构。
- 变更路由前请在 README 更新说明，记录鉴权策略等信息。

## 变更记录
- 2025-??-??：接入 `react-router-dom`，新增登录 `/login`、注册 `/register` 以及受保护的首页 `/`。通过 `ProtectedRoute` 统一做登录校验，未认证用户会被重定向到登录页并携带来源地址。
