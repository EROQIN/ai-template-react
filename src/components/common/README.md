# src/components/common 目录说明

收录跨页面复用的基础 UI 组件，例如 Button、Input、Modal。

## 约束
- 必须编写最小可用示例并记录 props。
- 尽量保持无状态，状态控制由上层调用者负责。
- 与设计系统保持一致，更新时记录设计稿版本。

## 组件记录
- `FullScreenLoader`: 全屏占位加载状态，支持自定义提示文案，供路由守卫或初始化流程复用。
- `BrandMark`: 展示 NJUPT 百事通品牌标识的徽章组件，可指定大小用于登录页与主布局。
