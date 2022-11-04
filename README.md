# x-console

entry（容器项目）
  - widget1（子页面项目）
  - widget2
  - ...

功能说明：entry 容器项目与 widget 子页面项目可单独打包
entry 进入后，调用 API，拿到 widget 信息（包含名称，路由，文件地址），通过 widget 信息懒加载 widget

特点：
1. entry 与 widget 单独打包并发布，方便回滚
2. widget 单独发布，方便其发布后共享到多个平台，不需要在各个平台各个打包并发布
3. 可由获取 widget 信息的 API 实现灰度


todo

- [ ] 改造成 monorepo 项目
- [ ] 构建后，输出打包数据，用于生成获取 widget 信息的 API 所用到的数据
- [ ] 输出 boilerplate，用于一键生成项目的工具库
- [ ] 开发环境下，entry 的 publicPath 只能指定为 '' 的问题？
- [ ] entry 中的 webpack_require，为啥import() 文件的动态时 和 静态时编译后不一样
- [ ] react-router-dom v6 中的路由嵌套问题
- [ ] common 库
- [ ] split chunk
- [ ] DLL
