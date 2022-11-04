// import() 编译后生成的代码，entry chunk 直接使用它来进行导入
export default function chunkImport(chunk) {
  return __webpack_require__.e(chunk).then(__webpack_require__.bind(__webpack_require__, chunk));
}
