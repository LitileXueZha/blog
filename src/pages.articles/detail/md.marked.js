import marked from 'marked';

const regMermaid = /^(graph|sequenceDiagram)/;
const regMathJax = /(\$|\\\()[\s\S]+?(\$|\\\))/gm;
const regLink = /^(<a.+?)">/;
const renderer = new marked.Renderer();

// monkey patch 猴子补丁
// 1. mermaid 转化
renderer.defaultCode = renderer.code;
renderer.code = (code, lang) => {
  if (code.match(regMermaid)) {
    return `<div class="mermaid">${code}</div>`;
  }

  return renderer.defaultCode(code, lang);
};

// 2. mathjax 转化
renderer.defaultCodespan = renderer.codespan;
renderer.codespan = (code) => {
  if (code.match(regMathJax)) {
    return `<span class="mathjax">${code}</span>`;
  }

  return renderer.defaultCodespan(code);
};

// 3. 生成目录，且文章内所有标题都降低一级
const catalogs = ['<ol class="nav tc-scrollspy">'];
let headingCount = 0;
let second = false;
const regHead = /id="(\S+?)"/;

renderer.defaultHeading = renderer.heading;
renderer.heading = (text, level, ...args) => {
  // 把文章内容中的标题全部降低一级
  const realLevel = level < 6 ? level + 1 : level;
  const defaultHead = renderer.defaultHeading(text, realLevel, ...args);
  // 转化文章标题为锚链接
  const anchorId = regHead.exec(defaultHead)[1];
  const $anchor = `<a href="#${anchorId}">${text}</a>`;

  if (level === 1) {
    // 处理一级目录
    // 处理完 h2 后拼接上 ul
    const ext = second ? '</ul></li>' : '</li>';
    const first = headingCount === 0;

    // 修改 headingId 并重置 h2
    headingCount += 100;
    second = false;
    catalogs.push(`${first ? '' : ext}<li>${$anchor}`);
  } else if (level === 2) {
    // 处理二级目录
    headingCount += 1;

    if (second) {
      // 有 h2，表示这是第二个 h2
      catalogs.push(`<li>${$anchor}</li>`);
    } else {
      second = true;
      // 二级目录第一个
      catalogs.push(`<ul class="nav"><li>${$anchor}</li>`);
    }
  }

  return defaultHead;
};
// SEO: 给链接添加 rel="nofollow"，减小权重流失
renderer.defaultLink = renderer.link;
renderer.link = (...args) => {
  const linkHtml = renderer.defaultLink(...args);
  // 保留原有功能，正则加上
  const linkSeo = linkHtml.replace(regLink, '$1" rel="nofollow noopener noreferrer">');

  return linkSeo;
};

// 5. 任务列表添加样式类名
renderer.defaultListitem = renderer.listitem;
renderer.listitem = (text, task) => {
  if (task) {
    return `<li class="task-list-item">${text}</li>\n`;
  }

  return `<li>${text}</li>\n`;
};

// 设置
marked.setOptions({ renderer });

/**
 * 转化 `md` 并生成目录
 *
 * @param {String} content md 内容
 * @returns {Array} 第一项为内容，第二项为目录
 */
export default function markedWithCatalog(content) {
  const results = [marked(content)];

  // 存在目录时
  if (headingCount > 0) {
    // 最后再拼上 ol
    catalogs.push('</ol>');
    results.push(catalogs.join(''));
  }

  return results;
}
