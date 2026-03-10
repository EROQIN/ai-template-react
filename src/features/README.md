# src/features 目录说明

用于承载独立业务能力的垂直切片，如 UserManagement、ChatWorkflow 等。

## 使用约定
- 每个 feature 建立单独目录，内部包含组件、hooks、api、store 等。
- 对外只暴露公共接口（组件/函数），内部结构可自行组织。
- 新建 feature 后必须在此记录负责人、依赖和路由入口。

## Feature 记录
- 2025-??-??：`chat` 模块（页面内组合），依赖 `chatSessionController`、`chatHistoryController` 与 `chatController` 完成会话列表、聊天历史与发送消息的读取。
