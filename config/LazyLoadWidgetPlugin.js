const path = require('path');
const { ReplaceSource, SourceMapSource } = require('webpack-sources');

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
  return `
    (self["webpackJsonp"] = self["webpackJsonp"] || []).push([
      ["${chunkId}"],
      {
        "${chunkId}": (
          (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
              "default": () => {
  `;
}
function getPostfix() {
  return `
                return module.default;
              }
            });
          }
        )
      }
    ]);`;
}

function LazyLoadWidgetPlugin(options = {}) {
  const { publicPath = '' } = options;

  this.options = {
    publicPath,
  };
}

LazyLoadWidgetPlugin.prototype.apply = function (compiler) {
  function chunkFn(compilation, callback) {
    for (let file in compilation.assets) {
      let chunkId = path.join(this.options.publicPath, file);

      const asset = compilation.assets[file];
      try {
        const { source, map } = asset.sourceAndMap();

        let replaceSource = new ReplaceSource(asset);
        const length = source.length;
        replaceSource.insert(length - 1, getPostfix());
        replaceSource.insert(0, getPrefix(chunkId));

        compilation.assets[file] = replaceSource;
        // let resultText = replaceSource.source();
        // let resultMap = replaceSource.map({
        //     columns: false
        // });
        // let outputSource = new SourceMapSource(
        //     resultText,
        //     file,
        //     resultMap,
        //     source,
        //     map
        // );

        // compilation.assets[file] = outputSource;
      } catch (error) {
        compilation.errors.push(new Error(`${file} from chunk loader plugin`));
      }
    }
    callback && callback();
  }

  if (compiler.hooks) {
    const plugin = { name: 'LazyLoadWidgetPlugin' };
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

module.exports = LazyLoadWidgetPlugin;
