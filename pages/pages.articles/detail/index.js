/**
 * highlight.js使用。
 * 支持的语言地址：https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#language-names-and-aliases
 * 常用语言可查看：https://highlightjs.org/download/#download-form
 * 手动引用比默认引用全部更高效
 * 1. 全部加载达到500K，手动只需40K
 */

import marked from 'marked';
import 'highlight.js/styles/atom-one-light.css';
import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import http from 'highlight.js/lib/languages/http';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';

import './index.less';
import { Affix } from '../../common/plugins';

// 高亮语法
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('http', http);
hljs.registerLanguage('php', php);
hljs.registerLanguage('sql', sql);

const renderer = new marked.Renderer();
const defaultCode = renderer.code;

renderer.code = (code, lang) => {
  if (code.match(/^(sequenceDiagram|graph)/)) {
    return `<div class="mermaid">${code}</div>`;
  }

  return defaultCode.call(renderer, code, lang);
};

window.addEventListener('load', () => {


  const $mdBody = document.querySelector('.markdowned > .body');
  const $catalog = document.querySelector('.catalog > .content');
  const $loading = document.querySelector('.loading');
  const $article = document.querySelector('.container-article');


  fetch('https://note.youdao.com/yws/api/personal/sync?method=download&keyfrom=web&cstk=z5yuS0Cj', {
    method: 'POST',
    credentials: 'include',
    body: 'fileId=WEBd467fa3b5a26c28e1988d7f15bce160e&version=-1&read=true&cstk=z5yuS0Cj',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }).then(data => data.text()).then((text) => {
    // console.log(text);
    renderMD(text);
  });

  function renderMD(data) {
    // 显示article
    $loading.classList.remove('active');
    $article.classList.add('active');

    // 覆盖md转html的h1-h2标签
    let heading = '<ol class="nav">';
    let second = false;
    let headingCount = 0;

    renderer.heading = (text, level) => {
      if (level === 1) {
        const ext = second ? '</ul></li>' : '</li>';
        const first = headingCount === 0;
        // 修改headingId并重置h2
        headingCount = Math.floor(headingCount) + 1;
        second = false;
        // 拼接
        heading += `${first ? '' : ext}<li class="${first ? 'active' : ''}"><a href="#heading-${headingCount}">${text}</a>`;
      } else if (level === 2) {
        headingCount += 0.1;
        headingCount = parseFloat(headingCount.toFixed(1));
        if (second) {
          // 有h2，表示这是第二个h2
          heading += `<li><a href="#heading-${headingCount}">${text}</a></li>`;
        } else {
          second = true;
          heading += `<ul class="nav"><li class="${headingCount === 1.1 ? 'active' : ''}"><a href="#heading-${headingCount}">${text}</a></li>`;
        }
      }

      if (level > 2) {
        // 默认的渲染
        return `<h${level}>${text}</h${level}>`;
      }
      return `<h${level + 1} id="heading-${headingCount}">${text}</h${level + 1}>`;
    };
    $mdBody.innerHTML = marked(data, { renderer });
    $catalog.innerHTML = `<h1>目录</h1>${heading}</ol>`;

    Affix.init();
    hljs.initHighlighting();
    initMermaid();
  }

  function initMermaid() {
    // 动态加载mermaid.js流程图
    const $mermaids = document.querySelectorAll('.mermaid');

    if (!$mermaids) return;

    const $script = document.createElement('script');

    $script.src = 'https://unpkg.com/mermaid@7.1.0/dist/mermaid.js';
    // eslint-disable-next-line
    $script.addEventListener('load', () => mermaid.init(undefined, $mermaids));
    document.body.appendChild($script);
  }
});
