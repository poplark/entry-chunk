const path = require('path');
const { ReplaceSource, SourceMapSource } = require('webpack').sources;

function isLegacyTapable(tapable) {
  return tapable.plugin && tapable.plugin.name !== "deprecated";
};

function isSourceMap(input) {
  // All required options for `new SourceMapConsumer(...options)`
  // https://github.com/mozilla/source-map#new-sourcemapconsumerrawsourcemap
  return Boolean(
    input &&
      input.version &&
      input.sources &&
      Array.isArray(input.sources) &&
      typeof input.mappings === 'string'
  );
}

function getPrefix(chunkId) {
  return [
    `(self["webpackJsonp"] = self["webpackJsonp"] || []).push([`,
    `  ["${chunkId}"],`,
    `  {`,
    `    "${chunkId}": (`,
    `      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {`,
    `        __webpack_require__.r(__webpack_exports__);`,
    ``,
  ].join('\n');
}
function getPostfix(library) {
  return [
    ``,
    `        __webpack_require__.d(__webpack_exports__, {`,
    `          "default": () => ${library}.default`,
    `        });`,
    `      }`,
    `    )`,
    `  }`,
    `]);`
  ].join('\n');
}

function EntryChunkPlugin(options = {}) {
  const { publicPath = '' } = options;

  this.options = {
    publicPath,
  };
}

const PLUGIN_NAME = 'EntryChunkPlugin';
const SUPPORTED_LIBRARY_TYPE = ['var', 'umd', 'umd2'];

EntryChunkPlugin.prototype.apply = function (compiler) {
  /**
   * 将 entry 对应的 asset 添加 webpackJsonp 前缀，使其被载后，自动 push 到父级 modules 中进行缓存
   * @param {*} compilation 
   * @param {*} callback 
   * @returns 
   */
  function chunkFn(compilation, callback) {
    const { type, name: library } = compilation.outputOptions.library;
    if (!SUPPORTED_LIBRARY_TYPE.includes(type)) {
      const err = new Error(`The output.library.type of configuration of webpack must be one of ${SUPPORTED_LIBRARY_TYPE} when using ${PLUGIN_NAME}`);
      compilation.errors.push(err);
      return callback(err);
    }
    // todo - 检查 library.name 的格式，不支持时提示
    // 如果 filename 以 [name] [contenthash] [hash] 等等命名的，需要从 chunk 中找出 entry 的 asset 的文件名
    for (const chunk of compilation.chunks) {
      // todo - 不确定老版本，2,3,4 有 chunkGraph 概念，待验证
      if (compilation.chunkGraph.getNumberOfEntryModules(chunk) > 0) {
        for (const filename of chunk.files) {
          // entry chunk 中添加全局 webpackJsonp 前缀
          let chunkId = path.join(this.options.publicPath, filename);
          const asset = compilation.assets[filename];
          try {
            const { source, map } = asset.sourceAndMap();

            let replaceSource = new ReplaceSource(asset);
            const length = source.length;
            replaceSource.insert(length, getPostfix(library));
            replaceSource.insert(0, getPrefix(chunkId));

            compilation.assets[filename] = replaceSource;
          } catch (error) {
            compilation.errors.push(new Error(`${filename} from chunk loader plugin`));
          }
        }
      }
    }
    callback && callback();
  }

  if (compiler.hooks) {
    const plugin = { name: PLUGIN_NAME };
    compiler.hooks.compilation.tap(plugin, compilation => {
      compilation.hooks.additionalAssets.tapAsync(plugin, callback => {
        chunkFn.call(this, compilation, callback);
      });
    });
  } else {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('additional-assets', callback => {
        chunkFn.call(this, compilation, callback);
      });
    });
  }
};

EntryChunkPlugin.loader = require.resolve('./entry-chunk-loader')

module.exports = EntryChunkPlugin;
