# src/pages 目录说明

路由级页面组件的集合，每个页面应与路由配置一一对应。

## 使用约定
- 页面目录命名以 Page 结尾，文件默认导出 React 组件。
- 页面内部组合 features/components，尽量保持瘦控制器角色。
- 在此记录每个页面的入口文件和主要职责。

## 页面记录
- `LoginPage.tsx`: 登录入口，复用 `AuthPage.module.css` 的视觉规范以及 `authStore` 登录动作。
- `RegisterPage.tsx`: 账号注册页面，表单校验后调用注册接口并自动登录。
- `ChatPage.tsx` / `ChatPage.module.css`: 受保护的主界面，包含侧边栏会话列表、消息流与输入器，集成 `chatSession`、`chatHistory` 与 `chat` API。
