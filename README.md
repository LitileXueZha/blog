# Blog

博客站点源码

## 开始对于构建工具的思考

使用webpack，这也是自己较为熟悉的打包工具，能够将多文件打包、代码压缩，更方便的是模块开发。也有缺点，只会监听`.js`文件，对于其他文件如果没有放在`loader`中则不会热更新。

使用gulp，基于流的打包工具，目前只知道它能够运行一个个任务，然后构代码，需要手动监听，关键现在社区基本都转webpack了...

遇到的问题：

1. 原生`.html`构建，没法儿刷新
2. 文章id包含在路径中，如`xxxid.html`，这需要nginx转发做处理。webpack构建的dev-server显然没必要

第一个问题的折中解决：html-webpack-plugin提供模板生产，会用到loader加载，这样一来修改之后就能刷新了。也可以不用模板，直接html-loader能够返回字符串生成`.html`

由于不是生成单个.html文件，故不考虑这样（不太合语义）。设为`articles/detail?id=xxx`形式，使用query而不是用hash，因为hash会被认为同一个地址，不同文章应该有各自的地址，虽然返回同一个文件且由js加载文章数据。SEO的事之后再考虑

## 目录结构

<details>

```bash
├── node_modules          模块目录
├── src                   博客总目录
│   ├── assets            图片、视频等资源文件
│   ├── common            公共样式、js以及一些插件
│   ├── components        通用组件，诸如header等；icon_svg则是图标
│   ├── page.xxx          单个xxx页面，会生成xxx.html
│   │   ├── index.pug     html模版
│   │   ├── index.less    样式
│   │   └── index.js
│   ├── pages.xxx         二级目录，生成一个xxx目录
│   │   └── xxx           与上面page.xxx类似
│   └── layout.pug        博客总布局
├── pages.static          静态页面，内联css与js
│   ├── xxx               生成xxx.html静态页面
│   │   ├── index.js
│   │   └── index.pug
│   └── webpack.config.js 静态页专门的配置
├── webpack               细分配置文件
│   ├── index.js          基本
│   ├── loaders.js        一系列loader
│   └── pages.js          一系列entry以及插件（生成html文件）
├── .eslintrc             eslint配置
├── .gitignore            git忽略配置
├── favicon.ico           网站图标
├── package.json          模块配置
├── README.md             此说明文件
├── webpack.config.dev.js 开发配置
└── webpack.config.js     生产环境配置
```

</details>

## 部分 SEO 方案

使用 `.pug` 做为引擎时，打包出来的为静态 `.html` 文件。完全写死内容不可取，真正的 SSR 需要服务端支持。两难...

其实 `pug` 在编译时可以传入一些变量、数据，现在开发也是写死了数据调试。一开始的想法是在 `.pug` 中请求数据，但貌似编译过程是同步的，无法异步加载！

在启动 `webpack` 打包前，提前准备好数据是个选择。写个脚本跑 node 把数据写到 `.json` 文件中，`pug-loader` 里注入即可。

### 勤打包

😂 每次新增内容，首页并非是最新的，但好歹首页不至于空白。
