function rewriteChunkLoad(getPublicPath, getScriptFilename) {
  const loadFunc = [
    `const originalChunkLoadFunc = __webpack_chunk_load__;`,
    `__webpack_chunk_load__ = async (chunkId) => {`,
    `  const originalPublicPath = __webpack_public_path__;`,
    `  const path = ${getPublicPath}(chunkId);`,
    `  if (path !== undefined) {`,
    `    __webpack_public_path__ = path;`,
    `  }`,
    `  const res = await originalChunkLoadFunc(chunkId);`,
    `  __webpack_public_path__ = originalPublicPath;`,
    `  return res;`,
    `};`,
    `const originalGetFilenameFunc = __webpack_get_script_filename__;`,
    `__webpack_get_script_filename__ = (chunkId) => {`,
    `  const filename = ${getScriptFilename}(chunkId);`,
    `  if (filename !== undefined) {`,
    `    return filename;`,
    `  }`,
    `  return originalGetFilenameFunc(chunkId);`,
    `};`,
  ];
  return loadFunc.join('\n');
}

function defaultGetPublicPath(chunkId) {
  if (typeof chunkId === 'string') {
    if (chunkId.endsWith('.js') && (chunkId.startsWith('/') || chunkId.startsWith('http://') || chunkId.startsWith('https://'))) {
      return '';
    }
  }
}
function defaultGetScriptFilename(chunkId) {
  // chunkId 是以绝对路径、网络 URL命名的 js 文件时，不要再由 webpack 进行拼接 .js 后缀的处理
  if (typeof chunkId === 'string') {
    if (chunkId.endsWith('.js') && (chunkId.startsWith('/') || chunkId.startsWith('http://') || chunkId.startsWith('https://'))) {
      return chunkId;
    }
  }
}

module.exports = function(source) {
  const { getPublicPath = defaultGetPublicPath, getScriptFilename = defaultGetScriptFilename } = this.getOptions();
  for (const key of Object.keys(this._compiler.options.entry)) {
    // this.resource - 导入模块的 path
    if (this._compiler.options.entry[key].import.includes(this.resource)) {
      return `${source}\n${rewriteChunkLoad(getPublicPath.toString(), getScriptFilename.toString())}\n`;
    }
  }
  return source;
}
