# 我的日语自学小搭子

一个可本地运行的 React + Vite 小网站，用来管理日语学习路线、今日任务、阶段进度和学习笔记。

## 免费使用方式一：本地运行

1. 安装 Node.js。
2. 解压本项目。
3. 在项目目录运行：

```bash
npm install
npm run dev
```

4. 浏览器打开终端里显示的本地地址，通常是 `http://localhost:5173`。

## 免费使用方式二：在线开发平台

把这个项目上传到 StackBlitz、CodeSandbox 或 GitHub，再用 Vercel / GitHub Pages 部署。

## 数据保存说明

当前版本使用浏览器 localStorage 保存进度和笔记。也就是说：
- 不需要账号；
- 不需要数据库；
- 换浏览器/换设备后不会自动同步；
- 清理浏览器数据后，进度可能会消失。
