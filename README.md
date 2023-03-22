## x-console

本项目目的在于搭建控制台（包含多个独立产品或功能的站点），每个独立产品或功能可独立构建并部署，由后台 API（路由 API - 路由与 js 映射信息） 指定产品/功能的构建文件的加载地址，以此达到灵活控制用户对独立产品/功能点的加载地址。使用场景有：优化构建速度（构建粒度拆分到各产品/功能点）、各个产品/功能点的灰度等。

### 基本说明
entry（入口项目）
  - widget1（产品/功能点子页面项目）
  - widget2
  - ...

功能说明：entry 容器项目与 widget 子页面项目可单独打包
entry 进入后，调用 API，拿到 widget 信息（包含名称，路由，文件地址），通过 widget 信息懒加载 widget。

特点：
1. entry 与 widget 单独打包并发布，方便回滚
2. widget 单独发布，方便其发布后共享到多个平台，不需要在各个平台分别打包并发布
3. 可由获取 widget 信息的 API 实现灰度

command:

### 生产构建

1. 构建 entry 项目

```sh
yarn entry
```

将构建后的产物置于 web 服务器中。

2. 构建 widget 项目

```sh
yarn widget widgetName [basePublicPath]
```

将构建后的产物置于 basePublicPath 指定的 web 服务器中。不指定时，需要置于 entry 同 web 服务器中。

注：
> 1. widgetName 为 widget 的名称
> 2. basePublicPath 为 widget 将要部署到的服务器地址，如 `yarn widget sw http://x.y.z` 构建后，将需要从 http://x.y.z/widget/sw/sw.js 加载构建后的文件，不加 basePublicPath 时，将从 /widget/sw/sw.js 加载。一般使用 CDN 时需要指定 basePublicPath。还可能的命令有 `yarn widget sw https://x.y.z` 或 `yarn widget sw //x.y.z` 等。

### 本地开发

开启 widget 和 entry 的 dev server，用于本地预览/测试，需要在最外层目录中创建 widgets.json 文件

widgets.json 示例
```js
[
  {
    "name": "wa",
    "path": "/wa",
    "file": "/widget/wa/wa.js"
  },
  {
    "name": "wb",
    "path": "/wb"
    "file": "http://x.y.z/widget/wb/wb.js"
  }
]

```

1. multiple compiler 模式 - entry 和若干个 widget 一起生成 multiple compiler，用同一个 dev server 开启本地服务

```sh
yarn start
```

优点：共用一个 dev-server，不管指定指定多少个 widget 都只开启一个 node 子进程
缺点：可能跟生产环境中 entry 和 widget 部署的场景不同

2. multiple server 模式 - entry 和若干 widget 各自开启 dev server

```sh
yarn start2
```

优点：更贴合生产环境中 entry 与 widget 可能部署到不同地址的场景
缺点：entry 占一个 node 子进程，每多指定一个 widget 就多开启一个 node 子进程


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
