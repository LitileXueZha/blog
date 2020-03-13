import './index.less';
import { Ripple, fetch } from '../../common';

window.addEventListener('load', () => {
  Ripple.init();

  initTags();
});

/** 加载标签列表，绑定筛选 */
async function initTags() {
  const $list = document.querySelector('.filter-tag .list');
  const { items } = await fetch('/tags');
  const frags = items.map((tag) => {
    return `
      <li class="filter-item tag">
        <input id="${tag.id}" type="radio" name="tag" value="${tag.id}" />
        <label class="item" for="${tag.id}">${tag.name}</label>
      </li>
    `;
  });

  $list.innerHTML = frags.join('');

  // 只有在标签列表渲染完后才能绑
  addFilterListener((values) => {
    const params = {};

    Object.keys(values).forEach((key) => {
      // 剔除空值与全选
      if (values[key] && values[key] !== 'all') {
        params[key] = values[key];
      }
    });

    console.log(params);
  });

  // 标签点击量统计
  const { hash } = window.location;
  const tagId = hash.substr(1);

  if (tagId && items.find(tag => tag.id === tagId)) {
    fetch('/tags/click', {
      method: 'HEAD',
      params: { id: tagId },
    });
    document.querySelector(`input#${tagId}`).checked = true;
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
      const { name, value, type } = e.target;

      switch (type) {
        case 'radio':
          params[name] = value;
          break;
        case 'checkbox': {
          if (!params[name]) params[name] = [];

          const { checked } = e.target;
          const param = params[name];
          const index = param.indexOf(value);

          if (checked && index < 0) {
            param.push(value);
          } else if (!checked && index > -1) {
            param.splice(index, 1);
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
