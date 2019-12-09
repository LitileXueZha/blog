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
import { Affix, Scrollspy, Ripple } from '../../common/plugins';

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
  Ripple.init();


  const $mdContainer = document.querySelector('.markdowned');
  const $mdTitle = $mdContainer.querySelector('.title');
  const $mdBody = $mdContainer.querySelector('.body');
  const $catalog = document.querySelector('.catalog > .content');
  const $loading = document.querySelector('.loading');
  const $article = document.querySelector('.container-article');
  const $more = document.querySelector('.container-more');

  // 简单地拿文件名
  // const filename = decodeURIComponent(location.search).replace(/^\?id=(.+)$/, '$1');
  const filename = '破万重浪未往矣/Markdown - 语法.md';

  if (window.fetch) {
    fetch(`/Markdown/${filename}`).then(data => data.text()).then((text) => {
      setTimeout(() => renderMD(text), 1000);
    });
  } else {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        setTimeout(() => renderMD(xhr.responseText), 1000);
      }
    };
    xhr.open('GET', `/Markdown/${filename}`);
    xhr.send();
  }

  function renderMD(data) {
    // 定义title
    document.title = 'Markdown - 语法_滔\'s 博客';
    $mdTitle.innerHTML = 'Markdown - 语法';
    // 显示article
    $loading.classList.remove('active');
    $article.classList.add('active');
    $more.classList.add('active');

    // 覆盖md转html的h1-h2标签
    let heading = '<ol class="nav tc-scrollspy">';
    let second = false;
    let headingCount = 0;
    const prefix = 'heading';

    renderer.heading = (text, level) => {
      if (level === 1) {
        const ext = second ? '</ul></li>' : '</li>';
        const first = headingCount === 0;
        // 修改headingId并重置h2
        headingCount = Math.floor(headingCount) + 1;
        second = false;
        // 拼接
        heading += `${first ? '' : ext}<li class="${first ? 'active' : ''}"><a href="#${prefix}-${headingCount}">${text}</a>`;
      } else if (level === 2) {
        headingCount += 0.1;
        headingCount = parseFloat(headingCount.toFixed(1));
        if (second) {
          // 有h2，表示这是第二个h2
          heading += `<li><a href="#${prefix}-${headingCount}">${text}</a></li>`;
        } else {
          second = true;
          heading += `<ul class="nav"><li class="${headingCount === 1.1 ? 'active' : ''}"><a href="#${prefix}-${headingCount}">${text}</a></li>`;
        }
      }

      if (level > 2) {
        // 默认的渲染
        return `<h${level}>${text}</h${level}>`;
      }
      return `<h${level + 1} id="${prefix}-${headingCount}">${text}</h${level + 1}>`;
    };
    $mdBody.innerHTML = marked(data, { renderer });
    $catalog.innerHTML = `<h1>目录</h1>${heading}</ol>`;

    Affix.init();
    Scrollspy.init();
    hljs.initHighlighting();
    initMermaid();
    initMathJax();
  }

  function initMermaid() {
    // 动态加载mermaid.js流程图
    const $mermaids = document.querySelectorAll('.mermaid');

    if (!$mermaids.length) return;

    const $script = document.createElement('script');

    $script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mermaid/7.1.2/mermaid.min.js';
    // eslint-disable-next-line
    $script.addEventListener('load', () => mermaid.init(undefined, $mermaids));
    document.body.appendChild($script);
  }

  function initMathJax() {
    // 动态加载数学公式MathJax支持
    if (/(\$\$|\\\().+(\$\$|\\\))/m.test(document.body.innerHTML)) {
      const $script = document.createElement('script');

      $script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML';
      $script.addEventListener('load', () => MathJax.Hub.Configured());
      document.body.appendChild($script);
    }
  }

  // 监听全屏F11，keyCode = 122
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 122) {
      e.preventDefault();
      fullscreen($mdContainer);
    }
  });
});

function fullscreen(dom) {
  if (dom.requestFullscreen) {
    dom.requestFullscreen();
  } else if (dom.webkitRequestFullscreen) {
    dom.webkitRequestFullscreen();
  } else if (dom.mozRequestFullScreen) {
    dom.mozRequestFullScreen();
  } else if (dom.msRequestFullscreen) {
    dom.msRequestFullscreen();
  }
}
