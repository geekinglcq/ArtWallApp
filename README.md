# 🎨 ArtWall 挂画展示应用

一个现代化的挂画展示 Web 应用，支持自定义墙面、画框、画作的所见即所得设计工具。

## ✨ 功能特性

### 🏠 墙面设置
- 自定义墙面尺寸
- 墙面颜色选择
- 背景图片上传

### 🖼️ 画框管理
- 支持多种形状：长方形、正方形、圆形、扇形
- 可调节画框大小、位置、边框宽度和颜色
- 支持衬纸设置（宽度、颜色）

### 🎯 画作设置
- 支持图片上传
- 支持图片 URL 输入
- 自动适配画框形状

### 💫 所见即所得
- 实时预览效果
- 响应式设计，移动端友好
- 一键导出高清效果图

### 💾 配置管理
- 本地配置保存和加载
- YAML格式配置导出/导入
- 配置文件版本管理
- 跨设备配置共享

## 🚀 快速开始

### 方法一：本地开发

1. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm start
   ```

3. **访问应用**
   打开浏览器访问 http://localhost:3000

### 方法二：Docker 部署

1. **构建镜像**
   ```bash
   docker build -t artwall-app .
   ```

2. **运行容器**
   ```bash
   docker run -d -p 8080:80 artwall-app
   ```

3. **访问应用**
   打开浏览器访问 http://localhost:8080

### 方法三：一键云部署

#### Vercel 部署
1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 上连接你的 GitHub 仓库
3. 设置构建目录为 `frontend`
4. 一键部署

#### Netlify 部署
1. 在 [Netlify](https://netlify.com) 上连接你的 GitHub 仓库
2. 设置构建命令：`cd frontend && npm run build`
3. 设置发布目录：`frontend/build`
4. 一键部署

## 📱 移动端支持

本应用采用响应式设计，完美适配：
- 📱 手机端
- 📱 平板端
- 💻 桌面端

## 🛠️ 技术栈

- **前端框架**：React 18
- **UI 组件库**：Ant Design 5
- **画布渲染**：Konva.js + React-Konva
- **配置管理**：js-yaml + localStorage
- **样式**：CSS3 + Flexbox
- **构建工具**：Create React App
- **部署**：Docker + Nginx

## 📁 项目结构

```
ArtWallApp/
├── frontend/                 # React 前端应用
│   ├── public/              # 静态资源
│   │   ├── src/
│   │   │   ├── components/      # React 组件
│   │   │   │   ├── WallEditor.js      # 墙面编辑器
│   │   │   │   ├── FrameEditor.js     # 画框编辑器
│   │   │   │   ├── CanvasDisplay.js   # 画布显示
│   │   │   │   └── FrameShape.js      # 画框形状
│   │   │   ├── App.js           # 主应用组件
│   │   │   ├── index.js         # 应用入口
│   │   │   └── styles.css       # 全局样式
│   │   └── package.json         # 依赖配置
├── Dockerfile              # Docker 构建文件
├── nginx.conf              # Nginx 配置
└── README.md               # 项目说明
```

## 🎯 使用指南

### 1. 设置墙面
- 调整墙面宽度和高度
- 选择墙面颜色
- 可选：上传背景图片

### 2. 添加画框
- 点击"新增画框"
- 选择画框形状（长方形/正方形/圆形/扇形）
- 调整尺寸、位置、边框样式
- 可选：添加衬纸

### 3. 添加画作
- 上传本地图片，或
- 输入网络图片 URL
- 图片会自动适配画框形状

### 4. 配置管理
- 点击"保存配置"保存当前设计到本地
- 点击"加载配置"从本地或YAML文件恢复设计
- 点击"导出YAML"下载配置文件用于分享
- 点击"重置配置"清除所有设置

### 5. 导出效果图
- 点击"导出效果图"按钮
- 生成高清 PNG 图片并自动下载

## 🎨 设计亮点

- **直观易用**：无需编程知识，纯 GUI 操作
- **功能丰富**：支持多种画框形状和自定义选项
- **视觉美观**：现代化 UI 设计，视觉体验佳
- **性能优化**：使用 Canvas 渲染，流畅无卡顿
- **移动友好**：完美适配各种设备尺寸

## 🐛 问题反馈

如遇到问题或有功能建议，请提交 Issue 或 Pull Request。

## 📄 许可证

MIT License

---

**享受你的挂画设计之旅！** 🎨✨ 