import './index.less';
import { Ripple, fetch, randomColor, humanDate } from 'src/index.js';

window.addEventListener('load', async () => {
  Ripple.init();

  const $loadMore = document.getElementById('load-more');
  // 分页加载
  let page = 1;
  const size = 10;
  const data = await fetch('/msg', {
    params: { page, size },
  });
  let loading = false;

  renderMsg(data.items);
  // 加载更多事件
  $loadMore.addEventListener('click', async () => {
    // 防重加载
    if (loading) return;

    loading = true;
    page += 1;

    const { total, items } = await fetch('/msg', {
      params: { page, size },
    });

    renderMsg(items);
    // 无更多
    if (total <= page * size) {
      $loadMore.parentNode.innerHTML = '暂无更多';
    }
    loading = false;
  });
  if (data.total <= size) {
    // 无更多，移除最后一条列表
    $loadMore.parentNode.parentNode.removeChild($loadMore.parentNode);
  }

  const $form = document.getElementById('form-msg');
  const $msgList = document.querySelector('.list-msg');
  const $myMsg = document.getElementById('my-msg');
  let submitting = false;

  // 缓存中获取用户名
  $form.name.value = localStorage.getItem('username');
  // 表单提交事件
  $form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = $form.name.value.trim();
    const content = $form.content.value.trim();

    // 防重与空校验
    if (submitting || !name || !content) return;

    submitting = true;
    await fetch('/msg', {
      method: 'POST',
      body: { name, content, platform: 'pc' },
    });

    const $li = createMsgListItem({ name, content, create_at: Date.now() });

    $msgList.insertBefore($li, $myMsg.nextElementSibling);
    $form.content.value = '';
    // 缓存用户名
    localStorage.setItem('username', name);
    submitting = false;
  });
});

function renderMsg(data) {
  const $msgList = document.querySelector('.list-msg');
  const $frag = document.createDocumentFragment();

  data.forEach((msg) => {
    const $li = createMsgListItem(msg);

    $frag.appendChild($li);
  });

  $msgList.insertBefore($frag, $msgList.lastChild);
}

/**
 * 创建留言 `li` 元素
 * 
 * @param {object} msg 留言数据
 * @return {HTMLLIElement}
 */
function createMsgListItem(msg) {
  const { escapeHtml } = window.TC;
  const $li = document.createElement('li');
  // 有头像展示头像，无头像展示名称第一个字 + 随机色
  const cover = msg.avatar
    ? `<img src="${escapeHtml(msg.avatar)}" class="msg-cover" alt="头像" width="50" height="50" />`
    : `<div class="msg-cover" style="color: ${randomColor()}">${escapeHtml(msg.name[0])}</div>`;

  $li.className = 'msg';
  $li.innerHTML = `
    ${cover}
    <div class="msg-content">
      <h3 class="tc-font-title">
        ${escapeHtml(msg.name)}
        <time class="msg-time">${humanDate(msg.create_at)}</time>
      </h3>
      <p class="msg-summary">${escapeHtml(msg.content)}</p>
    </div>
  `;

  return $li;
}
