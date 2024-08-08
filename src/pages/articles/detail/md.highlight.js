// 主题
import 'highlight.js/styles/atom-one-light.css';

/**
 * highlight.js 使用。
 *
 * 支持的语言地址：https://highlightjs.readthedocs.io/en/latest/css-classes-reference.html#language-names-and-aliases
 * 常用语言可查看：https://highlightjs.org/download/#download-form
 *
 * 手动引用比默认引用全部更高效：全部加载达到500K，手动只需40K
 */

import hljs from 'highlight.js/lib/core';
// 语言列表
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import http from 'highlight.js/lib/languages/http';
import php from 'highlight.js/lib/languages/php';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import diff from 'highlight.js/lib/languages/diff';
import shell from 'highlight.js/lib/languages/shell';
import yaml from 'highlight.js/lib/languages/yaml';
import txt from 'highlight.js/lib/languages/plaintext';
import latex from 'highlight.js/lib/languages/latex';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';

// 高亮语法
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('http', http);
hljs.registerLanguage('php', php);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('plaintext', txt);
hljs.registerLanguage('tex', latex);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);

export default () => hljs.highlightAll();
