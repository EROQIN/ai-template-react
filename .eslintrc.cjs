// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended', // 关键：添加 prettier 插件
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'], // 确保 prettier 在这里
  rules: {
    'react-refresh/only-export-components': 'warn',
    'prettier/prettier': 'error', // 将 prettier 问题视为 ESlint 错误
    '@typescript-eslint/no-unused-vars': 'warn', // 对未使用的变量提出警告
    // 你可以在此添加更多严格的规则，例如：
    'no-console': 'warn', // 不鼓励使用 console.log
  },
};