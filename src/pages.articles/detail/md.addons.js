/** 初始化 mermaid */
export function initMermaid() {
  // 动态加载mermaid.js流程图
  const $mermaids = document.querySelectorAll('.mermaid');

  if (!$mermaids.length) return;

  const $script = document.createElement('script');

  $script.src = 'https://unpkg.com/mermaid@8.3.1/dist/mermaid.min.js';
  // eslint-disable-next-line
  $script.addEventListener('load', () => mermaid.init(undefined, $mermaids));
  document.body.appendChild($script);
}

/**
 * 初始化 mathjax
 *
 * @see https://docs.mathjax.org/en/latest/web/configuration.html
 */
export function initMathJax() {
  // 动态加载数学公式MathJax支持
  const $mathjax = document.querySelectorAll('.mathjax');

  // 没有 latex 公式
  if ($mathjax.length === 0) return;

  const $script = document.createElement('script');

  $script.src = 'https://unpkg.com/mathjax@3.0.0/es5/tex-chtml.js';
  $script.async = true;
  // mathjax v3 的配置
  window.MathJax = {
    startup: {
      typeset: false,
    },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
    },
  };
  $script.addEventListener('load', () => {
    // IE 11 上莫名的问题。只能拿到 MathJax 对象上部分属性和方法
    // 置于 event loop 中貌似执行完成了
    setTimeout(() => {
      // eslint-disable-next-line
      MathJax.typesetPromise($mathjax).catch(MathJax.typesetClear);
    });
  });

  document.body.appendChild($script);
}
