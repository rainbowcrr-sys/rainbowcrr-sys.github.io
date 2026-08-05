# Search Enhancer — 网站部署指南

## 文件说明

| 文件 | 作用 |
|---|---|
| `index.html` | 主页面（中英文双语） |
| `styles.css` | Apple 简约风格样式 |
| `script.js` | GitHub Star 实时计数 + 交互逻辑 |
| `CNAME` | 自定义域名 `rainbowcrr.club` |

## 部署到 GitHub Pages（3 步）

### 1. 创建 GitHub 仓库

在你的账号下新建一个仓库，推荐两种命名：

- **用户页**（域名直接是 `rainbowcrr.club`）：仓库名随意，比如 `search-enhancer-site`
- **项目页**（域名是 `rainbowcrr.club/search-enhancer`）：仓库名 `search-enhancer`

### 2. 上传这 4 个文件

把 `index.html`、`styles.css`、`script.js`、`CNAME` 上传到仓库根目录。

### 3. 开启 GitHub Pages

1. 仓库 → **Settings** → 左侧 **Pages**
2. **Source** 选 `Deploy from branch`
3. **Branch** 选 `main`，文件夹选 `/ (root)`
4. 点 **Save**

等几十秒，访问 `https://rainbowcrr-sys.github.io/search-enhancer-site/` 就能看到。

## 绑定自定义域名 rainbowcrr.club

### Cloudflare 侧

1. 登录 Cloudflare → 选你的域名 `rainbowcrr.club`
2. **DNS** → **Records** → 添加：
   - **Type**: `CNAME`
   - **Name**: `@`（或 `www`，看你想用哪个）
   - **Target**: `rainbowcrr-sys.github.io`
   - **Proxy status**: 开启（橙色云朵 ☁️）
3. 去 **SSL/TLS** → 设成 **Full** 或 **Full (strict)**

### GitHub 侧

- 仓库里已经有 `CNAME` 文件，内容是 `rainbowcrr.club`
- 在 **Settings → Pages → Custom domain** 里填入 `rainbowcrr.club`
- GitHub 会自动签发 SSL 证书（几分钟）

## Star 按钮说明

`script.js` 里调用了 GitHub API：
```
GET https://api.github.com/repos/rainbowcrr-sys/search-enhancer
```
返回 JSON 里的 `stargazers_count` 就是实时 star 数。每 5 分钟自动刷新一次。

> ⚠️ 未认证 API 限速 60 次/小时/IP。对个人网站够用。如果担心超限，可以加个 GitHub Token（在请求头里加 `Authorization: Bearer <token>`），限速提升到 5000 次/小时。

## 目录结构

```
search-enhancer-site/
├── index.html      ← 主页面
├── styles.css      ← 样式
├── script.js       ← JS 逻辑
├── CNAME           ← 自定义域名
└── DEPLOY.md       ← 本文件
```

## 技术栈

- 纯 HTML + CSS + 原生 JS（无框架依赖）
- Google Fonts: Inter（英文）+ Noto Sans SC（中文）
- GitHub API 实时 Star 数
- 零 npm、零构建步骤
