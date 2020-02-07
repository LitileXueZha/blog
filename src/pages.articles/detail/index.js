import QueryString from 'query-string';

import './index.less';
import {
  Affix,
  Scrollspy,
  Ripple,
  fetch,
  humanDate,
} from '../../common';
import initHighlightJS from './md.highlight';
import { initMermaid, initMathJax } from './md.addons';
import marked from './md.marked';

/** 在页面上展示错误提示 */
function renderErrorContent() {
  const $container = document.querySelector('main.tc-container');
  const $error = document.createElement('div');

  $error.className = 'error-content';
  $error.innerHTML = '<p class="tc-container">文章不存在或已下线</p>';
  $container.parentNode.insertBefore($error, $container);
}

window.addEventListener('load', async () => {
  const params = QueryString.parse(window.location.search);
  const { id } = params;

  if (!id) {
    // 读取不到文章 id
    renderErrorContent();
    return;
  }

  const data = await fetch(`/articles/${id}`).catch(renderErrorContent);

  renderArticle(data);

  // 初始化
  Ripple.init();
  Affix.init();
  Scrollspy.init();
  initHighlightJS();
  initMermaid();
  initMathJax();

  // 监听全屏F11，keyCode = 122
  const $mdContainer = document.querySelector('.markdowned');

  window.addEventListener('keydown', (e) => {
    if (e.key === 'F11') {
      e.preventDefault();
      fullscreen($mdContainer);
    }
  });

  initFormComment(id);
  const comments = await fetch('/comments', {
    params: { parent_id: id },
  });

  renderComments(comments.items);
});

/**
 * 渲染文章
 *
 * @param {Object} data 文章数据
 */
function renderArticle(data) {
  // 无数据，不渲染
  if (!data) return;

  const {
    title,
    content,
    tag_name: tagName,
    create_at: createAt,
    bg,
  } = data;

  const $mdContainer = document.querySelector('.markdowned');
  const $mdTitle = $mdContainer.querySelector('.title');
  const $createAt = $mdContainer.querySelector('.time');
  const $tag = $mdContainer.querySelector('.tag');
  const $mdBody = $mdContainer.querySelector('.body');
  const $catalog = document.querySelector('.catalog > .content');
  const $article = document.querySelector('.container-article');

  // 定义title
  document.title = `${title}_滔's 博客`;
  $mdTitle.innerText = title;
  // 设置时间与标签
  $createAt.innerText = humanDate(createAt);
  $tag.innerText = tagName;

  // 生成 markdown html
  const [mdHtml, catalog] = marked(content);

  $mdBody.innerHTML = mdHtml;
  // 有目录时渲染
  $catalog.innerHTML = catalog ? `<h2 class="catalog-title">目录</h2>${catalog}` : '无目录';
  // 有封面时插入图片到目录
  if (bg) {
    const $cover = document.createElement('img');

    $cover.src = bg;
    $cover.alt = '封面';
    $cover.className = 'cover';
    $cover.height = 200;
    $catalog.parentNode.insertBefore($cover, $catalog);
  }

  // 移除骨架屏
  $article.classList.remove('skeleton');
  $article.removeChild($article.querySelector('.skeleton-article'));
  $article.removeChild($article.querySelector('.skeleton-catalog'));
}

/** 初始化评论提交 */
function initFormComment(articleId) {
  const $form = document.querySelector('#form-comment');
  const $content = $form.content;
  let submitting = false; // 防重
  const submit = async (e) => {
    e.preventDefault();

    // trim() 还会剔除换行符
    const content = $content.value.trim();
    const body = {
      parent_id: articleId,
      content,
      type: 0, // 类型为文章的评论
    };

    // 未输入
    if (!content || submitting) return;

    // 提交中
    submitting = true;

    const res = await fetch('/comments', {
      method: 'POST',
      body,
    });
    // 请求成功后，直接添加一条“刚刚”评论
    const $commnetList = document.querySelector('.list-comment');
    const $comment = document.createElement('li');

    $comment.className = 'comment';
    $comment.innerHTML = `
      <time class="comment-at">刚刚</time>
      <p class="comment-content">${window.TC.escapeHtml(res.content)}</p>
    `;

    $commnetList.insertBefore($comment, $commnetList.firstElementChild);
    console.log(res);
    // 提交完后清空
    $content.value = '';
    submitting = false;
  };

  $form.addEventListener('submit', submit);
  $content.addEventListener('keydown', (e) => {
    // 按 Ctrl + Enter 可快捷提交
    if (e.ctrlKey && e.key === 'Enter') {
      submit(e);
    }
  });
}

function renderComments(data, isLoadMore = false) {
  if (isLoadMore) {
    //
  }
  const $commnetList = document.querySelector('.list-comment');
  const comments = data.map(item => `
    <li class="comment">
      <time class="comment-at">${humanDate(item.create_at)}</time>
      <p class="comment-content">${window.TC.escapeHtml(item.content)}</p>
    </li>
  `);

  $commnetList.innerHTML = comments.join('');
}

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
