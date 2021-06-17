const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
// 配置文件别名
module.exports = {
  chainWebpack: config => {
    config.resolve
      .alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components') )
      .set('views', resolve('src/views'))
  },
  devServer: {
    proxy: {
        '/api': {
            // 此处的写法，目的是为了 将 /api 替换成 https://
            target: 'https://interface.sina.cn/news/wap',
            // 允许跨域
            changeOrigin: true,
            ws: true,
            pathRewrite: {
                '^/api': ''
            }
        },
        '/163': {
          target: "https://c.m.163.com/ug/api/wuhan/app/data/list-total",
          changeOrigin: true,
          ws: true,
          pathRewrite: {
              '^/163': ''
          }
        },
    },
    disableHostCheck: true
}
}