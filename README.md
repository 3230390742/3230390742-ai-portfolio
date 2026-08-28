# 磨海清｜AI 应用工程作品集

一个以项目证据为核心的个人作品集，聚焦本地优先 RAG、Agent / MCP、React 与 FastAPI 产品交付。页面采用 React、TypeScript 和 Vite 构建，并针对桌面端与移动端提供自动化验证。

## 本地运行

```powershell
npm ci
npm run dev
```

## 验证与构建

```powershell
npm run lint
npm run check
npm run test:e2e
npm run lighthouse
```

Playwright 会构建并启动本地生产预览，覆盖桌面端、移动端、关键流程、无障碍检查和视觉快照。生产构建输出到 `dist/`。

## 内容维护

- 公开项目资料统一维护在 `src/content/portfolio.ts`。
- 项目媒体位于 `public/media/projects/`，公开简历位于 `public/resume/`。
- 仓库不收录密钥、账号资料、本机绝对路径、私有知识库正文或未经核实的项目材料。

本项目暂不绑定域名；后续添加正式地址时，应同步更新页面元数据、`robots.txt` 和相应测试，再重新执行完整验证。
