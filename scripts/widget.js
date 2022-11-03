const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('../config/webpack.widget.base.js');

const widget = process.argv[2];

console.log(`widget ${widget} 将被编译`);

const config = replaceEntry(merge(baseConfig, require(`../widgets/${widget}/webpack.config.js`)), widget);

console.log(`widget ${widget} 配置信息`, config);

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.warn('!!!!!! compile error !!!!!!');
    // console.error(err);
    return;
  }
  const { errors } = stats;
  if (errors) {
    console.info(`widget ${widget} 构建失败`);
    // console.errors(errors);
    return;
  }
  console.info(`widget ${widget} 构建完成`);
  // console.info(stats.chunks);

  compiler.close((closeErr) => {
    // ...
  });
})

function replaceEntry(config, widgetName) {
  const entryType = Object.prototype.toString.call(config.entry);
  switch (entryType) {
    case '[object String]':
      config.entry = {
        [widgetName]: config.entry
      };
      break;
    case '[object Object]':
      const entries = Object.entries(config.entry);
      if (entries.length === 0) {
        const [_, mainEntry] = entries[0]; // todo - 只获取第一个么？？？
        config.entry = {
          [widgetName]: mainEntry
        };
      } else {
        // todo - 不应该支持多 entry ？？
        config.entry = {};
        for (const i in entries) {
          const [_, mainEntry] = entries[i];
          config.entry[`${widgetName}-${i}`] = mainEntry;
        }
      }
      break;
    case '[object Function]':
    case '[object Undefined]':
    case '[object Null]':
    default:
      console.warn(`The entry of webpack config - ${JSON.stringify(config.entry)} may be wrong!`);
      break;
  }
  return config;
}
