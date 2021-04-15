export default '# 博客\n\
\n\
博客页面\n\
\n\
## 开始对于构建工具的思考\n\
\n\
使用webpack，这也是自己较为熟悉的打包工具，能够将多文件打包、代码压缩，更方便的是模块开发。也有缺点，只会监听`.js`文件，对于其他文件如果没有放在`loader`中则不会热更新。\n\
\n\
使用gulp，基于流的打包工具，目前只知道它能够运行一个个任务，然后构代码，需要手动监听，关键现在社区基本都转webpack了...\n\
\n\
遇到的问题：\n\
\n\
1. 原生`.html`构建，没法儿刷新\n\
2. 文章id包含在路径中，如`xxxid.html`，这需要nginx转发做处理。webpack构建的dev-server显然没必要\n\
\n\
第一个问题的折中解决：html-webpack-plugin提供模板生产，会用到loader加载，这样一来修改之后就能刷新了。也可以不用模板，直接html-loader能够返回字符串生成`.html`\n\
\n\
由于不是生成单个.html文件，故不考虑这样（不太合语义）。设为`articles/detail?id=xxx`形式，使用query而不是用hash，因为hash会被认为同一个地址，不同文章应该有各自的地址，虽然返回同一个文件且由js加载文章数据。SEO的事之后再考虑\n\
\n\
## 目录结构\n\
\n\
```bash\n\
├── node_modules          模块目录\n\
├── pages                 博客总目录\n\
│   ├── assets            图片、视频等资源文件\n\
│   ├── common            公共样式、js以及一些插件\n\
│   ├── components        通用组件，诸如header等；icon_svg则是图标\n\
│   ├── page.xxx          单个xxx页面，会生成xxx.html\n\
│   │   ├── index.pug     html模版\n\
│   │   ├── index.less    样式\n\
│   │   └── index.js\n\
│   ├── pages.xxx         二级目录，生成一个xxx目录\n\
│   │   └── xxx           与上面page.xxx类似\n\
│   └── layout.pug        博客总布局\n\
├── pages.static          静态页面，可单独放到任一位置\n\
│   ├── xxx               生成xxx.html静态页面\n\
│   │   ├── index.js\n\
│   │   └── index.html\n\
│   └── webpack.config.js 静态页专门的配置\n\
├── webpack               细分配置文件\n\
│   ├── loaders.js        一系列loader\n\
│   └── pages.js          一系列entry以及插件（生成html文件）\n\
├── .eslintrc             eslint配置\n\
├── .gitignore            git忽略配置\n\
├── favicon.ico           网站图标\n\
├── package.json          模块配置\n\
├── README.md             此说明文件\n\
└── webpack.config.js     打包总配置\n\
```\n\
一段css代码\n\
```css\n\
/* helo */\n\
div {\n\
  width: 100%;\n\
}\n\
```\n\
一段js代码\n\
```js\n\
// Helo\n\
class a extends b {\n\
\n\
}\n\
for (let i = 0;i < 2;i ++) {\n\
  const a = \'b\';\n\
  const b = () => {};\n\
  break;\n\
  function a() {}\n\
  console.log("aaa")\n\
}\n\
```\n\
一段nginx代码\n\
```nginx\n\
# helo\n\
server {\n\
  server_name xxx;\n\
  location /  {\n\
\n\
  }\n\
}\n\
```\n\
一段html代码\n\
```html\n\
<!-- Helo -->\n\
<div>aa</div>\n\
<img src="xxx">\n\
```\n\
\n\
> 静态资源文件生成后还在源文件目录里，需手动copy，静态文件很少改变，没必要每次都重新覆盖之，打包了哪个直接用哪个就行了。并且静态文件的样式与js为内联方式，直接嵌入到了.html文件里\n\
# 你好\n\
# 大家好\n\
';
