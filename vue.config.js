const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { merge } = require('lodash')

// 判断 build:server OR build:client
const TARGET_NODE = process.env.WEBPACK_TARGET === 'node'
const target = TARGET_NODE ? 'server' : 'client'
const outputDir = process.env.VUE_APP_OUTDIR_NAME
module.exports = {
  publicPath: './',
  outputDir: `./${outputDir}/${target}`,
  configureWebpack: (_) => ({
    entry: `./entry.${target}.js`,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined,
    },
    devtool: 'source-map',
    target: TARGET_NODE ? 'node' : 'web',
    module: {},
    optimization: TARGET_NODE
      ? {
          splitChunks: {
            name: 'manifest',
            minChunks: Infinity,
          },
        }
      : {},
    plugins: ((_) =>
      [
        TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
      ].filter((item) => item != null))(),
  }),
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        merge(options, {
          optimizeSSR: false,
        })
      })
  },
}
