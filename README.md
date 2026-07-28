# 磨海清 AI 应用工程作品集

## 本地开发

```powershell
npm install
npm run dev
```

## 完整验证

```powershell
npm run check
npm run test:e2e
npm run lighthouse
```

Playwright 默认构建并启动本地生产预览，覆盖 `1440x900` 桌面端与 `390x844` 手机端。视觉基线由 Windows Chromium 审阅；其他平台会跳过视觉快照，其余关键流程与无障碍测试照常执行。

## 内容更新

公开内容统一维护在 `src/content/portfolio.ts`。所有事实必须与已审阅的简历和项目证据一致，不得加入本地绝对路径、内部来源 ID、凭据或未经验证的贡献。

部署媒体放在 `public/media/projects/`，简历放在 `public/resume/`。浏览器代码不得引用仓库顶层的 `output/`。

## 部署

- Vercel 项目名：`3230390742-ai-portfolio`
- Framework Preset：Vite
- Build Command：`npm run build`
- Output Directory：`dist`

预览部署后，通过 `PLAYWRIGHT_TEST_BASE_URL` 对远端运行关键流程：

```powershell
$env:PLAYWRIGHT_TEST_BASE_URL='https://preview.example.vercel.app'
npx playwright test tests/e2e/portfolio.spec.ts tests/e2e/accessibility.spec.ts --project=desktop-chromium
Remove-Item Env:PLAYWRIGHT_TEST_BASE_URL
```

生产地址应为 `https://3230390742-ai-portfolio.vercel.app/`。若 Vercel 分配了不同的稳定项目域名，必须同步更新 `index.html`、`public/robots.txt`、`public/sitemap.xml` 与 `src/content/metadata.test.ts`，重新验证并再次部署。
