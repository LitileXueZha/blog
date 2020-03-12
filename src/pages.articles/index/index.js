import './index.less';
import { Ripple, fetch } from '../../common';

window.addEventListener('load', () => {
  Ripple.init();

  initTags();

  const $filters = document.querySelector('.filters');
  const $inputs = $filters.querySelectorAll('input');

  // 监听筛选关闭
  const params = {};
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

      onChange(params);
    });
  });

  function onChange(values) {
    console.log(values);
  }
});

async function initTags() {
  const data = await fetch('/tags');

  console.log(data);
}
