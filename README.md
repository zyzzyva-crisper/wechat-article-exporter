<p align="center">
  <img src="./assets/logo.svg" alt="Logo">
</p>

# wechat-article-exporter

![GitHub stars]
![GitHub forks]
![GitHub License]
![Package Version]


一款在线的 **微信公众号文章批量下载** 工具，支持私有化部署。本 fork 默认只保留 **扫码登录 → 拉取公众号文章列表 → 批量导出 HTML（含图片）→ 打包 zip 下载** 的流程，用于个人私用。

支持下载各种文件格式，其中 HTML 格式可100%还原文章排版与样式。

交流群(QQ): `991482155`

## :bell: 重要告知：项目域名调整
项目域名调整如下：

|     | 下载站                            | 文档站                        |
|-----|--------------------------------|----------------------------|
| 调整后 | https://down.mptext.top        | https://docs.mptext.top    |
| 调整前 | https://exporter.wxdown.online | https://docs.wxdown.online |

具体细节可以查看 [这里](https://docs.mptext.top/misc/domain.html)。


## :rocket: 本地运行

```bash
yarn install
yarn dev
```

默认启动后访问 `http://localhost:3000`。

## :whale: Docker 运行

```bash
docker build -t mptext-downloader .
docker run --rm -p 3000:3000 \
  -e ACCESS_CONTROL_MODE=basic \
  -e BASIC_AUTH_USER=your_user \
  -e BASIC_AUTH_PASS=your_pass \
  mptext-downloader
```

## :cloud: Cloudflare / VPS 部署（可选）

> **安全建议：** 暴露到公网时必须启用访问控制（Cloudflare Access 或 Basic Auth），可叠加 IP allowlist。

### Cloudflare Pages

1. `yarn build`
2. 将 `dist` 部署到 Cloudflare Pages（或用官方 `wrangler pages`）。
3. 通过 Cloudflare Access 限制访问（建议开启）。

### VPS（Node/Docker）

1. 按 “Docker 运行” 启动服务。
2. 反向代理（如 Nginx/Caddy）并启用 TLS。
3. 设置 `ACCESS_CONTROL_MODE=basic` 或通过 Cloudflare Access 代理访问。

## :lock: 访问控制配置

| 环境变量 | 说明 |
| --- | --- |
| `ACCESS_CONTROL_MODE` | `none` / `basic` / `cloudflare` |
| `BASIC_AUTH_USER` | Basic Auth 用户名 |
| `BASIC_AUTH_PASS` | Basic Auth 密码 |
| `ACCESS_ALLOWLIST` | 允许的 IP 列表，逗号分隔，支持 IPv4/CIDR（例如 `1.2.3.4,10.0.0.0/24`） |

## :shield: 安全说明

**威胁模型（假设）：**
- 服务可能暴露到公网，存在未授权访问风险。
- 服务需要与微信后台通信，存在敏感 cookie/session 暴露风险。

**已做的防护：**
- 访问控制：支持 Cloudflare Access / Basic Auth，并可叠加 IP allowlist。
- cookie/session 仅保存在内存中，不落盘。
- 删除遥测/统计/错误上报配置。
- 后端提供 `/api/clear` 清除 cookie 与缓存；前端提供“退出并清除数据”一键清理。
- 日志不打印 headers/body/query。

**仍然存在的风险：**
- 浏览器本地缓存（IndexedDB/LocalStorage）仍属于本机数据，建议仅在可信设备上使用。
- 微信侧封禁策略不可控；频繁抓取可能触发风控。
- 若反向代理或宿主机日志未脱敏，仍可能泄露请求信息。

## :books: 如何使用？

该工具的使用教程已移至 [文档站点](https://docs.mptext.top)。


## :dart: 特性

- [x] 搜索公众号，支持关键字搜索
- [x] 支持导出 html 格式（含图片与样式，保证文章样式还原）
- [x] 缓存文章列表数据，减少接口请求次数
- [x] 支持文章过滤，包括作者、标题、发布时间、原创标识、所属合集等
- [x] 支持合集下载
- [x] 支持图片分享消息
- [x] 支持视频分享消息
- [x] 支持 Docker 部署
- [x] 支持 Cloudflare/VPS 部署


## :heart: 感谢

- 感谢 [Deno Deploy]、[Cloudflare Workers] 提供免费托管服务
- 感谢 [WeChat_Article] 项目提供原理思路


## :star: 支持

如果你觉得本项目帮助到了你，请给作者一个免费的 Star，感谢你的支持！


## :bulb: 原理

在公众号后台写文章时支持搜索其他公众号的文章功能，以此来实现抓取指定公众号所有文章的目的。


## :memo: 许可

MIT

## :red_circle: 声明

本程序承诺，不会利用您扫码登录的公众号进行任何形式的私有爬虫，也就是说不存在把你的账号作为公共账号为别人爬取文章的行为，也不存在类似账号池的东西。

您的公众号只会服务于您自己的抓取文章的目的。

通过本程序获取的公众号文章内容，版权归文章原作者所有，请合理使用。若发现侵权行为，请联系我们处理。


## :chart_with_upwards_trend: Star 历史

[![Star History Chart]][Star History Chart Link]



<!-- Definitions -->

[GitHub stars]: https://img.shields.io/github/stars/wechat-article/wechat-article-exporter?style=social&label=Star&style=plastic

[GitHub forks]: https://img.shields.io/github/forks/wechat-article/wechat-article-exporter?style=social&label=Fork&style=plastic

[GitHub License]: https://img.shields.io/github/license/wechat-article/wechat-article-exporter?label=License

[Package Version]: https://img.shields.io/github/package-json/v/wechat-article/wechat-article-exporter


[Deno Deploy]: https://deno.com/deploy

[Cloudflare Workers]: https://workers.cloudflare.com

[Wechat_Article]: https://github.com/1061700625/WeChat_Article

[Star History Chart]: https://api.star-history.com/svg?repos=wechat-article/wechat-article-exporter&type=Timeline

[Star History Chart Link]: https://star-history.com/#wechat-article/wechat-article-exporter&Timeline

[在线网站]: https://down.mptext.top
