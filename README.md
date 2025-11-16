# AI Template React

一个面向 AI 协作的 React + Vite 模板，提供清晰的目录约束、统一的编码规范以及 OpenAPI 代码生成脚本，帮助人类与 AI 共同迭代复杂前端项目。

## 技术栈 & 特性
- **React 19 + Vite 7 + TypeScript 5.9**：现代化的开发体验与快速 HMR。
- **Ant Design 5**：默认 UI 组件库，可结合 `message` 等反馈组件。
- **Axios 实例化封装**：`src/lib/axios.ts` 统一处理 baseURL、超时、拦截器与登录态跳转。
- **路径别名 `@/*`**：在 `tsconfig` 与 Vite 中已配置，保证导入路径一致。
- **ESLint + Prettier + Husky + lint-staged**：提交前自动格式化与约束。
- **OpenAPI 生成器**：`npm run openapi2ts` 基于 `openapi2ts.config.ts` 同步最新服务端接口。

## 快速开始
1. 安装依赖：`npm install`
2. 启动开发服务器：`npm run dev`

常用脚本：
- `npm run build`：类型检查 + 生产构建。
- `npm run lint` / `npm run format`：手动触发静态检查/格式化。
- `npm run openapi2ts`：根据 `schemaPath` 拉取接口定义并生成到 `src`。

> 提交代码前会自动执行 lint-staged，请确保本地通过。

## 目录结构
```
├── public/                      # 静态资源，产物时原样复制
├── src/
│   ├── App.tsx                  # 根组件，渲染 <AppRoutes />
│   ├── main.tsx                 # React 入口，挂载全局样式
│   ├── assets/                  # 构建期静态资源（含 README）
│   ├── components/              # 全局 UI 组件（含 common/layout README）
│   ├── config/                  # 环境配置映射
│   ├── features/                # 业务垂直切片入口
│   ├── hooks/                   # 复用型自定义 Hooks
│   ├── lib/                     # 第三方库封装（含 axios.ts）
│   ├── pages/                   # 路由级页面，如 HomePage.tsx
│   ├── routes/                  # 路由配置，当前导出 AppRoutes
│   ├── stores/                  # 全局状态（Zustand/Redux 等）
│   ├── styles/                  # 全局样式，含 global.css
│   ├── types/                   # 全局类型定义，index.ts 聚合导出
│   └── utils/                   # 纯函数工具
├── openapi2ts.config.ts         # OpenAPI 生成配置
├── eslint.config.js / .prettierrc
├── tsconfig*.json               # 路径别名与编译配置
├── vite.config.ts               # 启用 React 插件与路径解析
└── README.md                    # 当前文件，AI 协作手册
```
> 每个子目录都包含一个 README，用来记录模块职责、约束与后续变更。新增内容时请同步更新对应 README。

## 协作规范

### 路径与模块
- 必须使用 `@/*` 绝对路径别名，禁止 `../..` 形式。
- 公共组件存放于 `src/components`，与特定业务强绑定的内容放在 `src/features/<FeatureName>/`.

### 样式
- 默认使用 `src/styles/global.css` 提供的基础样式与 `.app-shell` 布局。
- 新增全局样式需在 `src/styles/README.md` 中记录；局部样式可按需引入 CSS Modules 或 CSS-in-JS，并在对应 README 说明。

### 页面与路由
- 所有页面组件放在 `src/pages`，命名为 `<Name>Page.tsx`。
- 路由逻辑集中在 `src/routes/index.tsx`，扩展 react-router 时也要同步 README 说明导航结构。

### API 与数据
- 所有网络请求通过 `src/lib/axios.ts` 导出的实例，保持统一的 baseURL、超时与登录态处理。
- 若需要新增 API 模块，请在 `src/lib` 下创建对应封装，并更新 `src/lib/README.md`。
- 运行 `npm run openapi2ts` 可同步后端接口类型，配置项在 `openapi2ts.config.ts`。

### 状态管理
- 全局状态统一放在 `src/stores`（推荐 Zustand/Redux）。新增 store 时在 README 说明作用域、持久化策略以及与页面/feature 的关联。

### 文档与协作
- 修改目录结构、约束或通用逻辑时务必更新相关 README，并在本文件补充规则。
- 所有 PR 需要通过 lint/format 检查；若自动修复失败请手动修正。

## TODO / 下一步
- 接入 react-router 并在 `AppRoutes` 中管理实际路由表。
- 根据业务需要在 `src/features` 中创建功能模块，并完善各自 README。
- 补充 `public/README.md` 与其他子目录 README 的 TODO 记录，保持协作透明。
