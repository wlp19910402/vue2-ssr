const fs = require('fs')
const path = require('path')
const cli = require('cli-color')
// 创建 express 服务
const express = require('express')
const server = express()
// const outputDir = process.env.VUE_APP_OUTDIR_NAME
const outputDir = 'dist'
// 创建渲染器
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require(path.resolve(
  __dirname,
  `../${outputDir}/server/vue-ssr-server-bundle.json`
))
const clientManifest = require(path.resolve(
  __dirname,
  `../${outputDir}/client/vue-ssr-client-manifest.json`
))
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: fs.readFileSync(
    path.resolve(__dirname, '../public/index.temp.html'),
    'utf-8'
  ),
  clientManifest,
})

// 处理静态文件请求
server.use(
  express.static(path.resolve(__dirname, `../${outputDir}/client`), {
    index: false, // 不设置为 false 会导致无法查看网页源代码，搜索引擎将无法爬取
  })
)

// 通用服务 ==> 查看网页都是 GET 请求
server.get('*', async (req, res) => {
  try {
    const context = {
      url: req.url, // 请求 url ==> router.push(url)
      title: ``, // 网页标题
      metas: ``, // 写网站关键词，网站描述，给爬虫看
    }
    const html = await renderer.renderToString(context)
    res.send(html)
  } catch (error) {
    console.log(error)
    res.status(500).end('Internal Server Error')
  }
})

// 监听服务
server.listen(3000, (_) => {
  console.log(cli.green.underline('http://localhost:3000'))
  console.log(cli.green.underline('http://127.0.0.1:3000'))
})
