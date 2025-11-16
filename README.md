# [项目名称] AI 开发模板

本项目是一个为 AI 协作优化的 React 模板。

## 技术栈
* React 18
* Vite
* TypeScript
* ESLint (强约束)
* Prettier (强约束)
* Husky + lint-staged (自动修复)

## 如何运行
1.  `npm install`
2.  `npm run dev`

---

## **AI 开发规范 (必须遵守)**

### 1. 目录结构
```
my-ai-template/
├── public/
├── src/
│   ├── assets/              # 存放图片, svg 等
│   │   └── .gitkeep         # (空目录占位符)
│   ├── components/          # 全局通用 UI 组件
│   │   ├── common/          # (例如 Button, Input, Modal)
│   │   └── layout/          # (例如 Header, Footer, Sidebar)
│   ├── config/              # 配置文件 (例如 .env 变量的映射)
│   ├── hooks/               # 全局自定义 Hooks
│   │   └── .gitkeep
│   ├── lib/                 # 第三方库封装 (例如 axios 实例)
│   │   └── .gitkeep
│   ├── pages/               # 路由页面
│   │   └── HomePage.tsx     # (可以放一个示例页面)
│   ├── routes/              # 路由配置 (如果使用 react-router-dom)
│   │   └── index.tsx
│   ├── stores/              # 全局状态 (Zustand/Redux)
│   │   └── .gitkeep
│   ├── types/               # 全局 TS 类型
│   │   └── index.ts
│   ├── utils/               # 纯函数工具
│   │   └── .gitkeep
│   ├── App.tsx              # 根组件 (配置路由和布局)
│   ├── main.tsx             # 入口文件
│   └── styles/              # 全局样式
│       └── global.css
├── .env.example             # 环境变量示例 (告诉 AI 有哪些变量)
├── .eslintrc.cjs
├── .prettierrc
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md                # 关键：AI 的操作手册
```
* **`src/pages`**: 存放路由页面。
* **`src/components/common`**: 存放全局通用的 UI 组件 (如 `Button`, `Input`)。
* **`src/components/layout`**: 存放布局组件 (如 `Header`, `Sidebar`)。
* **`src/features`**: (如果 AI 创建新功能) 建议 AI 在此创建新目录，例如 `src/features/UserManagement/`，并将其组件、hooks、api 放在该目录内。
* **`src/hooks`**: 存放全局通用的 React Hooks。
* **`src/lib`**: 存放 `axios` 实例等第三方库的封装。
* **`src/utils`**: 存放纯函数 (如 `formatDate`)。
* **`src/types`**: 存放全局 TypeScript 类型。

### 2. 编码规范
* **路径导入**: 必须使用 `@/*` 绝对路径别名。禁止使用 `../` 相对路径。
    * *Good:* `import { Button } from '@/components/common/Button';`
    * *Bad:* `import { Button } from '../../components/common/Button';`
* **样式**: [说明你选择的方案，例如：请使用 CSS Modules / Tailwind / Styled-components]。
* **API 请求**: [说明规范，例如：所有 API 请求必须封装在 `src/lib/api/` 中，并使用 `src/lib/axios.ts` 实例]。
* **状态管理**: [说明规范，例如：全局状态请使用 Zustand，并在 `src/stores/` 中创建 slice]。

### 3. Git 提交
* 本项目已配置 `pre-commit` 钩子。
* 代码在提交时会自动进行 lint 和 format。如果不符合规范，提交将被阻止。