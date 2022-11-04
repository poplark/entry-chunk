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

const PLUGIN_NAME = 'EntryChunkPlugin';
const SUPPORTED_LIBRARY_TYPE = ['var', 'umd', 'umd2'];

class EntryChunkPlugin {
  apply(compiler) {
    if (compiler.hooks) {
      const plugin = { name: PLUGIN_NAME };
      compiler.hooks.compilation.tap(plugin, compilation => {
        compilation.hooks.additionalAssets.tapAsync(plugin, callback => {
          this._addAffixes(compilation, callback);
        });
      });
    } else {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('additional-assets', callback => {
          this._addAffixes(compilation, callback);
        });
      });
    }
  }

  /**
   * 将 entry 对应的 asset 添加 webpackJsonp 前缀，使其被载后，自动 push 到父级 modules 中进行缓存
   * @param {*} compilation 
   * @param {*} callback 
   * @returns 
   */
  _addAffixes(compilation, callback) {
    if (!this.isSupportedOptions(compilation)) {
      return callback(new Error(`output.library is not supported with ${PLUGIN_NAME}`));
    }
    for (const chunk of this.getEntryChunks(compilation)) {
      for (const filename of chunk.files) {
        this.addAffixes(compilation, filename);
      }
    }
    callback && callback();
  }

  /**
   * 向 entry chunk file 中添加 webpackJsonp 前缀和后缀
   * @param {t} compilation 
   * @param {*} filename 
   */
  addAffixes(compilation, filename) {
    const { name: library } = compilation.outputOptions.library;
    const { publicPath = ''} = compilation.outputOptions;
    // todo - 直接相加，无法处理中间 / 的问题，如 /a + main.js
    let chunkId = `${publicPath}` + `${filename}`;
    const asset = compilation.assets[filename];
    try {
      const { source, map } = asset.sourceAndMap();

      let replaceSource = new ReplaceSource(asset);
      const length = source.length;
      replaceSource.insert(length, this.getPostfix(library));
      replaceSource.insert(0, this.getPrefix(chunkId));

      compilation.assets[filename] = replaceSource;
    } catch (error) {
      compilation.errors.push(new Error(`${filename} from chunk loader plugin`));
    }
  }

  getPrefix(chunkId) {
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

  getPostfix(library) {
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

  isSupportedOptions(compilation) {
    const { type, name } = compilation.outputOptions.library;
    if (!SUPPORTED_LIBRARY_TYPE.includes(type)) {
      const err = new Error(`The output.library.type of configuration of webpack must be one of ${SUPPORTED_LIBRARY_TYPE} when using ${PLUGIN_NAME}`);
      compilation.errors.push(err);
      return false;
    }
    // todo - 检查 library.name 的格式，不支持时提示
    return true;
  }

  getEntryChunks(compilation) {
    const chunks = [];
    // 如果 filename 以 [name] [contenthash] [hash] 等等命名的，需要从 chunk 中找出 entry 的 asset 的文件名
    for (const chunk of compilation.chunks) {
      // todo - 不确定老版本，2,3,4 有 chunkGraph 概念，待验证
      if (compilation.chunkGraph.getNumberOfEntryModules(chunk) > 0) {
        chunks.push(chunk);
      }
    }
    return chunks;
  }
}

EntryChunkPlugin.loader = require.resolve('./loader');

module.exports = EntryChunkPlugin;
