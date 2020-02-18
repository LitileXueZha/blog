import QueryString from 'query-string';

import './index.less';
import { fetch } from '../common';

window.addEventListener('load', () => {
  const $suggest = document.querySelector('.suggest');
  const $info = document.querySelector('.info');
  const $result = document.querySelector('.result');
  const $resultNum = document.querySelector('.num');
  const $form = document.querySelector('#search');
  let searchText = '';

  /** 此页面的几个级别显示 */
  const PageShow = {
    /** 用户无输入 */
    noInput() {
      $result.classList.add('hidden');
      $info.className = 'info no-input';
    },
    /** 开发者篡改 `query` */
    developer() {
      $result.classList.add('hidden');
      $info.className = 'info for-developer';
    },
    /** 加载中 */
    loading() {
      $result.classList.add('hidden');
      $info.className = 'info loading';
    },
    /** 无结果 */
    noResult() {
      $result.classList.add('hidden');
      $info.className = 'info no-result';
    },
    /** 展示搜索结果 */
    result() {
      $info.className = 'info';
      $result.classList.remove('hidden');
    },
  };

  // 初始化 title 与输入框
  (function init() {
    const { q } = QueryString.parse(window.location.search);

    // 应该是开发者修改query导致不匹配，提示之
    if (q === undefined) {
      PageShow.developer();
      return;
    }

    searchText = q.trim();

    // 用户未输入
    if (!searchText) {
      PageShow.noInput();
      return;
    }

    document.title = `${searchText}_搜索_滔's 博客`;
    window.history.replaceState({ q: searchText }, document.title, window.location.search);
    $form.q.value = searchText;
    search(searchText);
    // 重置搜索次数
    setSearchTimes(true);
    // 隐藏建议按钮
    $suggest.querySelector('#close').addEventListener('click', () => setSearchTimes(true));
  }());

  /**
   * 当搜索表单提交时
   * 1. 阻止跳转
   * 2. 判断是否与上次输入一致，是则不做任何操作
   * 3. 更改title以及浏览器栏URL
   * 4. 若值为空，提示无输入
   * 5. ajax
   */
  $form.addEventListener('submit', (e) => {
    // Step1
    e.preventDefault();

    const value = $form.q.value.trim();

    // Step2: 输入与上次一致
    if (value === searchText) return;

    searchText = value;
    // Step3: 更改浏览器栏URL
    document.title = `${searchText ? `${searchText}_` : ''}搜索_滔's 博客`;
    window.history.pushState({ q: searchText }, document.title, `?q=${searchText}`);

    if (!searchText) {
      // Step4: 用户未输入字符
      PageShow.noInput();
      return;
    }

    search(searchText);
  });

  /**
   * 当触发浏览器Histroy改变时
   * 1. 上次无记录，应该是新页面打开/search.html，采取相应处理
   * 2. 取上次搜索值
   * 3. 更改表单输入值与页面title
   * 4. ajax
   */
  window.addEventListener('popstate', (e) => {
    if (!e.state) {
      document.title = '搜索_滔\'s 博客';
      searchText = '';
      $form.q.value = '';
      PageShow.developer();
      return;
    }

    searchText = e.state.q;
    $form.q.value = searchText;
    document.title = `${searchText ? `${searchText}_` : ''}搜索_滔's 博客`;

    if (searchText) search(searchText);
    else PageShow.noInput();
  });

  /**
   * 设置搜索无结果次数，超过三次提示。
   * @param {boolean} 指明需要重置，搜索成功时
   */
  function setSearchTimes(shouldReset = false) {
    if (shouldReset) {
      $suggest.classList.remove('active');
      window.sessionStorage.setItem('search_times', '0');
      return;
    }

    const times = parseInt(window.sessionStorage.getItem('search_times') || 0, 10);

    if (times >= 3) {
      $suggest.classList.add('active');
      window.sessionStorage.setItem('search_times', 0);
      return;
    }

    window.sessionStorage.setItem('search_times', times + 1);
  }

  /**
   * 搜索 & 渲染结果列表
   * 
   * @param {String} query 要搜索的内容
   */
  async function search(query) {
    if (!query) return;

    // 加载动画
    PageShow.loading();

    // 搜索计时
    const ts = Date.now();
    const data = await fetch('/search', {
      params: { q: query },
    });
    const { total, items } = data;

    // TODO: 一些分析待做
    console.log(`搜索"${query}"完成，耗时${(Date.now() - ts) / 1000}ms`);

    // 无结果
    if (total === 0) {
      PageShow.noResult();
      setSearchTimes();
      return;
    }

    $resultNum.textContent = `找到的结果数量约为 ${total}`;
    renderSearchResults(items, query);
    PageShow.result();
    setSearchTimes(true);
  }
});

/**
 * 渲染搜索结果
 * 
 * @param {array} data 搜索结果列表
 * @param {string} query 搜索内容
 */
function renderSearchResults(data, query) {
  const $results = document.querySelector('.result .list');
  const $frag = document.createDocumentFragment();

  data.forEach((item) => {
    const $li = document.createElement('li');

    $li.className = 'result-item';
    $li.innerHTML = `
      <h2 class="result-title">
        <a class="tc-font-title" href="${item.url}">${item.title}</a>
      </h2>
      <p class="result-content">${highlightHelper(item.summary || '-', query)}</p>
    `;
    $frag.appendChild($li);
  });

  const $newResults = $results.cloneNode();

  $newResults.appendChild($frag);
  $results.parentNode.replaceChild($newResults, $results);
}

/**
 * 高亮文本
 * 
 * 使用 `<mark>` 包裹高亮内容，空格做为分词符
 * 
 * @param {string} text 文本内容
 * @param {string} keyword 高亮内容
 */
function highlightHelper(text, keyword) {
  const { escapeHtml } = window.TC;
  const keywordStr = escapeHtml(keyword).split(' ').join('|');
  const reg = new RegExp(`(${keyword}|${keywordStr})`, 'gmi');

  return escapeHtml(text).replace(reg, '<mark>$1</mark>');
}
