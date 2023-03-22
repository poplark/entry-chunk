/**
 * 单个 widget 的构建脚本
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { replaceEntry } = require('./utils');
const EmitEntryInfoPlugin = require('../plugins/emit-entry-info-plugin');

const [_n, _s, widget, basePublicPath] = process.argv;

console.log(`widget ${widget} 将被构建`);

startWidget(widget, basePublicPath);

function startWidget(widget, basePublicPath) {
  const baseConfig = require('../config/webpack.widget.base');
  let publicPath = `/widget/${widget}/`;
  if (basePublicPath) publicPath = basePublicPath + publicPath;
  const config = replaceEntry(
    merge(
      baseConfig,
      require(`../widgets/${widget}/webpack.prod`),
      {
        output: {
          path: path.resolve(__dirname, `../dist/widget/${widget}`),
          publicPath,
          chunkLoadingGlobal: `webpack${widget}Jsonp`, // 需要为每个 widget 指定不同的 webpackJsonp 名称，不然可能会导致 widget chunk 加载时的冲突
        },
        plugins: [
          new EmitEntryInfoPlugin({
            callback: (files) => {
              // console.log(`${widget} 的入口文件有`, files);
              extractRouteConfig(widget, config, files);
            }
          })
        ],
      }
    ),
    widget,
  );

  console.log(`widget ${widget} 配置信息`, config);

  const compiler = webpack(config);
  compiler.run((err, stats) => {
    if (err) {
      console.warn('!!!!!! compile error !!!!!!');
      console.error(err);
      return;
    }
    const { errors } = stats;
    if (errors) {
      console.info(`widget ${widget} 构建失败`);
      console.errors(errors);
      return;
    }
    console.info(`widget ${widget} 构建完成`);
    // console.info(stats.compilation.chunks);
    console.info(stats.compilation.assets);

    // todo - 将生成的 assets 数据入库保存

    compiler.close((closeErr) => {
      // ...
    });
  })
}

/**
 * 生成该 widget 的路由及文件映射关系
 * @param {*} widgetName - widget 名称
 * @param {*} config - 该 widget 的 webpack 配置
 * @param {*} files - 该 widget 构建之后的 chunk 文件
 */
function extractRouteConfig(widgetName, config, files) {
  // todo - 将生成路由及文件映射关系入库
  console.log(`${widgetName} 的入口文件有`, files);
  if (files.length !== 1) throw new Error(`${widgetName}产出异常，请检查后重试`);

  const route = {
    name: widgetName,
    path: widgetName,
    file: config.output.publicPath + files[0],
  };

  const routesFile = path.resolve(__dirname, '../dist/entry/routes.json');
  let routes;
  if (fs.existsSync(routesFile)) {
    const data = fs.readFileSync(routesFile);
    try {
      routes = JSON.parse(data);
      const idx = routes.findIndex((item) => item.name = route.name);
      if (idx >=0) {
        routes.splice(idx, 1, route);
      } else {
        routes.push(route);
      }
    } catch(err) {
      routes = [route];
    }
  } else {
    routes = [route];
  }
  console.log(`${widget} 构建后的 routes 信息`, routes);
  fs.writeFileSync(routesFile, JSON.stringify(routes));
}
