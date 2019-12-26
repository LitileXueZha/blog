export * from './plugins';
import './index.less';

// 通用库的封装
window.TC = {
  // 防抖函数
  debounce(fn, duration = 400) {
    let timer = null;

    return () => {
      clearTimeout(timer);

      timer = setTimeout(fn, duration);
    };
  },
};

// 常用变量定义
window.REG_QUERY = /^\?(\w+)$/;
