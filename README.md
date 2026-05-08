# 随机抽签系统

## 🛠 技术栈
- Frontend: React 18 + Vite + Tailwind CSS
- Web Server: Nginx
- Container: Docker + Docker Compose

## 🚀 启动指南 (How to Run)
1. 确保 Docker Desktop 已启动。
2. 在根目录执行：`docker compose up --build`
3. 等待容器启动完成（首次构建可能需要几分钟）。
4. 打开浏览器访问：http://localhost:3000

## 🔗 服务地址 (Services)
- Frontend: http://localhost:3000

## ✨ 功能特性
- ✅ 从外部 data.js 文件动态加载抽签数据
- ✅ 可视化展示当前可抽选的总人数和剩余人数
- ✅ 可配置滚动速度（快速、中速、慢速、自定义）
- ✅ 可配置抽选数量（1人、2人、3人、5人、10人）
- ✅ 流畅的抽签动画效果，营造悬念感
- ✅ 防止重复抽取（已抽取的项目不会再次出现）
- ✅ 支持重置功能，清空结果并重新开始
- ✅ 支持再次抽签，继续从剩余候选项中抽取
- ✅ 现代简洁的 UI 设计，响应式布局，支持手机和电脑

## 📝 数据文件格式

`public/data.js` 文件应包含以下格式的数据：

```javascript
const lotteryData = [
  { id: 1, name: '张三', number: '001' },
  { id: 2, name: '李四', number: '002' },
  // ... 更多数据
];

window.lotteryData = lotteryData;
```

每个候选项应包含：
- `id`: 唯一标识符
- `name`: 姓名或名称
- `number`: 编号（可选，用于显示）

## 🔧 开发模式（本地开发）

如果需要本地开发，可以：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
.
├── public/
│   └── data.js              # 抽签数据文件
├── src/
│   ├── components/
│   │   └── LotterySystem.jsx # 主抽签组件
│   ├── App.jsx              # 应用入口组件
│   ├── main.jsx             # React 入口文件
│   └── index.css            # 全局样式
├── Dockerfile               # Docker 构建文件
├── docker-compose.yml       # Docker Compose 配置
├── nginx.conf               # Nginx 配置文件
├── index.html               # HTML 模板
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── tailwind.config.js       # Tailwind CSS 配置
```
