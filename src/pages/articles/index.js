import './index.less';
import {Ripple, fetch, humanDate} from 'src/index.js';

const SIZE = 10;
/** 全局查询文章条件 */
const query = {
  page: 1,
  size: SIZE,
};

document.addEventListener('DOMContentLoaded', async () => {
  Ripple.init();

  await Promise.all([initTags(), getArticles()]);

  let loading = false;
  const $btnMore = document.getElementById('more');

  $btnMore.addEventListener('click', async () => {
    if (loading) return;

    loading = true;
    query.page += 1;
    await getArticles(true);
    loading = false;
  });
});

/** 加载标签列表，绑定筛选 */
async function initTags() {
  const $list = document.querySelector('.filter-tag .list');
  const {items} = await fetch('/tags');
  const frags = items.map((tag) => window.TC.minifyHtmlTags(`
      <li class="filter-item tag">
        <input id="_${tag.id}" type="checkbox" name="tag" value="${tag.id}" />
        <label class="item" for="_${tag.id}">${tag.name}</label>
      </li>
    `));

  $list.innerHTML = frags.join('');

  // 只有在标签列表渲染完后才能绑
  addFilterListener(window.TC.debounce((values) => {
    Object.keys(values).forEach((key) => {
      if (values[key] && values[key] !== 'all') {
        query[key] = values[key];
      } else {
        // 剔除空值与全选
        delete query[key];
      }
    });

    // 重置分页
    query.page = 1;
    query.size = SIZE;

    getArticles();
  }));

  // 标签点击量统计
  const {hash} = window.location;
  const tagId = hash.substr(1);

  if (tagId && items.find((tag) => tag.id === tagId)) {
    fetch('/tags/click', {
      method: 'HEAD',
      params: {id: tagId},
    });
    document.getElementById(`_${tagId}`).checked = true;
    // 设置查询条件
    query.tag = tagId;
  }
}

/**
 * 绑定筛选项监听
 *
 * @param {function} listener 监听函数
 */
function addFilterListener(listener) {
  const $inputs = document.querySelectorAll('.filter-item input');
  const params = {};

  // 绑定每个 input，使用事件委托难以正确拿到 input
  Array.from($inputs).forEach(($input) => {
    $input.addEventListener('change', (e) => {
      const {name, value, type} = e.target;

      switch (type) {
        case 'radio':
          if (name === 'tag') {
            // 清空标签复选框
            params.tag?.forEach((id) => {
              document.getElementById(`_${id}`).checked = false;
            });
          }
          params[name] = value;
          break;
        case 'checkbox': {
          if (!params[name] || params[name] === 'all') params[name] = [];

          const {checked} = e.target;
          const param = params[name];
          const index = param.indexOf(value);

          if (checked && index < 0) {
            param.push(value);
          } else if (!checked && index > -1) {
            param.splice(index, 1);
          }
          if (name === 'tag') {
            document.getElementById('all1').checked = false;
          }
          break;
        }
        default:
          break;
      }

      listener(params);
    });
  });
}

async function getArticles(isLoadMore = false) {
  const data = await fetch('/articles', {
    params: query,
  });
  const $list = document.querySelector('.results .list');
  const $total = document.querySelector('.results .total');
  const $frag = document.createDocumentFragment();

  data.items.forEach((item) => {
    const $li = document.createElement('li');

    $li.className = 'list-item';
    $li.innerHTML = window.TC.minifyHtmlTags(`
      <section class="content tc-list-item-article">
        <h2 class="title">
          <a class="tc-font-title" href="/articles/${item.id}">${item.title}</a>
        </h2>
        <div class="description">
          <time title="发布时间" datetime="${item.create_at}">${humanDate(item.publish_at)}</time>
          <span title="标签">${item.tag_name}</span>
          <span title="点击量">000</span>
        </div>
        <p>${item.summary || '暂无简介~'}</p>
      </section>
      ${item.bg ? `<img src="${item.bg}" class="cover" alt="封面" width="40" height="40" />` : ''}
    `);
    $frag.appendChild($li);
  });

  if (isLoadMore) {
    $list.appendChild($frag);
  } else {
    const $newList = $list.cloneNode();

    $newList.appendChild($frag);
    $list.parentNode.replaceChild($newList, $list);
  }

  $total.textContent = `共 ${data.total} 篇`;

  if (data.total <= query.page * query.size) {
    document.getElementById('more').classList.add('tc-hidden');
  } else {
    document.getElementById('more').classList.remove('tc-hidden');
  }
}
