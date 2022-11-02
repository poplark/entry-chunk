function rewriteChunkLoad(replacePublicPath, replaceFilename) {
  const loadFunc = [
    `const originalChunkLoadFunc = __webpack_chunk_load__;`,
    `__webpack_chunk_load__ = async (id) => {`,
    `  const path = ${replacePublicPath}(id);`,
    `  if (path !== undefined) {`,
    `    __webpack_public_path__ = path;`,
    `  }`,
    `  return await originalChunkLoadFunc(id);`,
    `};`,
    `const originalGetFilenameFunc = __webpack_get_script_filename__;`,
    `__webpack_get_script_filename__ = (chunkId) => {`,
    `  const filename = ${replaceFilename}(chunkId);`,
    `  if (filename) {`,
    `    return filename;`,
    `  }`,
    `  return originalGetFilenameFunc(chunkId);`,
    `};`,
  ];
  return loadFunc.join('\n');
}

const replacePublicPath = function() {}
const replaceGetFilename = function() {}

module.exports = function(source) {
  const { replacePublicPath = replacePublicPath, replaceGetFilename = replaceGetFilename } = this.getOptions();
  for (const key of Object.keys(this._compiler.options.entry)) {
    if (this._compiler.options.entry[key].import.includes(this.resource)) {
      return `${source}\n${rewriteChunkLoad(replacePublicPath.toString(), replaceGetFilename.toString())}`;
    }
  }
  return source;
}
