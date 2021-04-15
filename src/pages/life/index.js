import './index.less';
import { Affix, Ripple, PaginationBase, fetch, Events } from 'src/index.js';
import { humanDate } from 'src/common/index.pug.js';

const DEFAULT_SIZE = 5;
const CATEGORY = 'life';
/** 当前季节（全局可变） */
let PERIOD;
const $event = new Events();
/** 分页器 */
const pager = new PaginationBase({
  size: DEFAULT_SIZE,
  onChange: fetchArticles,
});

window.addEventListener('load', async () => {
  const $btnMore = document.querySelector('#more');
  const $container = document.querySelector('.articles');

  initSeason();
  await pager.load();
  $event.add('seasonchange', async () => {
    $container.classList.add('loading');
    $btnMore.classList.remove('tc-hidden');
    await pager.goto(1);
    $container.classList.remove('loading');
  });
  $btnMore.addEventListener('click', () => pager.next());

  Affix.init();
  Ripple.init();
});

/** 初始化四季功能 */
function initSeason() {
  const initialPeriod = window.location.hash.substr(1);
  const $seasons = document.querySelectorAll('.time-quantum > .season');
  const $seasonObj = {};
  let $activeSeason = $seasons[0];

  Array.prototype.slice
    .call($seasons)
    .forEach(($dom) => {
      $seasonObj[$dom.dataset.id] = $dom;
    });

  toggleSeason(initialPeriod);
  window.addEventListener('hashchange', () => {
    const period = window.location.hash.substr(1);
    const $curSeason = $seasonObj[period];

    if ($curSeason === $activeSeason) {
      return;
    }

    toggleSeason(period);
    $event.dispatch('seasonchange');
  });

  /** 切换季节 */
  function toggleSeason(period) {
    const $season = $seasonObj[period] || $seasons[0];

    $activeSeason.classList.remove('active');
    $season.classList.add('active');
    $activeSeason = $season;
    PERIOD = $season.dataset.id;
  }
}

async function fetchArticles(params) {
  const { page, size } = params;
  const { items, total } = await fetch('/articles', {
    params: {
      page,
      size,
      category: CATEGORY,
      period: PERIOD,
    },
  });
  const $btnMore = document.querySelector('#more');
  const $container = document.querySelector('.articles');
  const $articles = $container.querySelector('.list-article');
  const $frag = document.createDocumentFragment();

  if (pager.isComplete(total)) {
    $btnMore.classList.add('tc-hidden');
  }

  items.forEach((article) => {
    const $li = document.createElement('li');

    $li.className = 'list-item tc-list-item-article';
    $li.innerHTML = `
      <h3 class="title">
        <a class="tc-font-title" href="/articles/${article.id}">${article.title}</a>
      </h3>
      <div class="description">
        <time title="发布时间" datetime="${article.create_at}">${humanDate(article.publish_at)}</time>`
        + '<i class="tc-divider"></i>'
        + `<span title="分类标签">${article.tag_name}</span>
      </div>
      <p>${article.summary}</p>
    `;
    $frag.appendChild($li);
  });
  // 加载更多时页码 >1
  if (page > 1) {
    $articles.appendChild($frag);
    return;
  }

  const $newArticles = $articles.cloneNode();

  $newArticles.appendChild($frag);
  $articles.parentNode.replaceChild($newArticles, $articles);
  $container.classList.remove('loading');
  // $newArticles.firstElementChild.scrollIntoView();
}
