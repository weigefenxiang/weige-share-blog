# WeiG Gitalk 2.x：一次完成 GitHub 登录配置（仅测试分支）

> 当前状态：评论、6 条回复、7 张图片均已显示且切回标签无图片重建；
> OAuth 前端已接好，但**你的 GitHub App 和 Cloudflare Worker 尚未创建/连接**。
> 两个外部账号操作由仓库管理员完成，不能通过提交代码代替。

**重要：以下密钥永远不要发给 AI、贴进聊天、提交到 GitHub，
或填入 Cloudflare Pages 的公开变量中。**

## 1. 创建并安装 GitHub App

使用拥有 `weigefenxiang/weige-share-blog` 权限的 GitHub 账号进入：

https://github.com/settings/apps → **New GitHub App**

- 名称自行选择（例如 `WeiG Gitalk Comments`，实际是否可用取决于 GitHub）。
- Repository permissions：**Discussions → Read and write**；
  **Metadata → Read-only**（默认）；其他权限不需要。
- Webhook：取消 Active。
- App 的 Callback URL 暂时留空，**部署 Worker 后再填**。
- 创建后保存 App ID 和**公开 Client ID**，在本机安全保存
  Client secret 和下载的 PEM private key。
- **安装**该 App，Repository access 选择 **Only select repositories**，
  仅授权 `weigefenxiang/weige-share-blog`，而非全部仓库。
- 确认仓库为 public、已启用 Discussions，并存在至少一个讨论分类。

## 2. 部署 OAuth Worker（密钥只留在服务端）

使用 Gitalk 上游维护的部署工具，唯一官方配置说明：

https://github.com/gitalk/gitalk/blob/main/packages/gitalk-deploy/README-CN.md

在本机**博客仓库之外**的私有目录创建 `.env`，依据上游 README 填写：

```dotenv
GITHUB_APP_ID=<刚创建的 App ID>
GITHUB_CLIENT_ID=<公开 Client ID>
GITHUB_CLIENT_SECRET=<保密>
GITHUB_APP_PRIVATE_KEY="<完整 PEM 私钥，包括 BEGIN/END 行>"
SESSION_ENCRYPTION_KEY=<本机生成 32 字节随机密钥>
GITALK_ALLOWED_ORIGINS=https://dev-gitalk2-eval.weige-share-blog.pages.dev
CLOUDFLARE_API_TOKEN=<仅用于部署的最小权限 Token>
```

`SESSION_ENCRYPTION_KEY` 可以在本机运行
`openssl rand -hex 32` 生成。Cloudflare API Token 推荐只给
**Account → Workers Scripts → Edit**、指定账号范围。

**先确认 Cloudflare 分支别名地址实际可用**。如果分支别名不通，
改用最新 Pages Preview 地址的精确 origin，例如
`https://1297cece.weige-share-blog.pages.dev`；
**注意每次新 Preview 的随机编号可能不同**，届时 Worker 白名单也要相应更新。
`GITALK_ALLOWED_ORIGINS` 是逗号分隔的完整 origin 列表，
不能把 `*.pages.dev` 当成已验证的通配规则。

在装好 Node.js 的本机私有目录运行：

```sh
npx github:gitalk/deploy -c .env -t cloudflare
```

该工具会校验变量、部署 Worker 并进行健康检查。确认能访问
`https://<你的-worker>.workers.dev/` 且返回
`{"ok":true,"service":"gitalk-proxy"}`。

**然后返回 GitHub App 设置，将 Callback URL 精确设置为**
`https://<你的-worker>.workers.dev/oauth/callback`。

别使用 Gitalk 官方自带的代理：它的跨域白名单不包含你的博客。

## 3. Cloudflare Pages 只填公开配置

打开 **Cloudflare → Workers & Pages → weige-share-blog →
Settings → Environment variables → Preview**，仅添加：

| 变量 | 公开值 |
| --- | --- |
| `WEIG_GITALK_CLIENT_ID` | App 的公开 Client ID（`Iv...`） |
| `WEIG_GITALK_PROXY_ORIGIN` | 你部署的 Worker HTTPS origin，不加路径 |

这两个值不是秘密；**不要把 App Secret、PEM、SESSION 密钥或 Cloudflare
Token 填在 Pages 中**。点击重新部署 `dev-gitalk2-eval`。

此实验分支的 `npm run build` 会自动运行 `postbuild`，
生成 `/zh-CN/gitalk2-eval/runtime-config.js`，
只包含公开 Client ID 和代理 origin。两个值缺一时构建失败；
都缺失时保留安全的匿名只读模式。

## 4. 验收

在新的 Preview 中打开
`/zh-CN/posts/WeiG-OpenWrt-AutoBuild-Guide/`：

1. 不再出现显眼的调试计数条；诊断在底部可选展开。
2. 点击 GitHub 登录，完成 GitHub App OAuth 授权后返回同一文章。
3. 检查显示的 GitHub 用户身份、注销、刷新页面保持状态。
4. **不要在原有 Discussion #10 随意发表测试回复。**
   需要创建单独测试 Discussion，审批后再写入/删除测试数据。
5. 反复切标签，确认 7 张图片仍保持、页面不闪烁。
6. 最后再验证评论提交、回复、反应、分页、语言映射和权限。
7. Gitalk 2.x 图片上传需要额外的 `onUploadImage` 接口，
   本阶段**尚未实现**；不能据此宣布全面替换 giscus 成功。

如遇 OAuth 失败：检查 App 是否安装在指定仓库、Callback URL、
Worker 白名单和 GitHub App 权限；敏感信息不要上传排查日志。

**外部操作完成后，仅需告诉下个 AI：公开 Client ID、公开 Worker
地址，以及新 Preview URL；不提供任何 secret 或 PEM。**

原有博客 `main` 和 `dev` 完全不动。验收通过前不得合并。
