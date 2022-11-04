const PLUGIN_NAME = 'EmitEntryInfoPlugin';

class EmitEntryInfoPlugin {
  constructor(options = {}) {
    const { callback = showEntryChunkFiles } = options;
    this.emitInfo = callback;
  }

  apply(compiler) {
    const plugin = {name: PLUGIN_NAME};
    compiler.hooks.done.tap(plugin, (stats) => {
      const { compilation } = stats;
      const files = [];
      for (const chunk of compilation.chunks) {
        if (compilation.chunkGraph.getNumberOfEntryModules(chunk) > 0) {
          for (const file of chunk.files) {
            files.push(file);
          }
        }
      }
      this.emitInfo(files);
    });
  }
}

function showEntryChunkFiles(files) {
  for (const file of files) {
    console.log(file);
  }
}

module.exports = EmitEntryInfoPlugin;
