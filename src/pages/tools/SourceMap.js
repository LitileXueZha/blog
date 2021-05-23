let SourceMapConsumer;
let TracebackJS;
const { debounce } = window.TC;

/**
 * 初始化 source map 解析
 * 
 * 动态加载解析库
 */
export default async function initSourceMap() {
  const $upload = document.getElementById('jsmap');
  const $name = document.querySelector('.upload-filename');
  const $resultJson = document.querySelector('.result-format');
  const $line = document.getElementById('line');
  const $column = document.getElementById('column');
  const $size = document.getElementById('size');
  const $resultSource = document.querySelector('.source-content');
  /** 解析后的源数据 */
  const mapSource = {
    line: 1,
    size: '-5+5',
  };

  // mozilla/source-map 底层依赖于 WebAssembly 解析
  if (!window.WebAssembly) {
    $resultJson.textContent = '浏览器不支持 WebAssembly';
    return;
  }

  $upload.addEventListener('change', () => {
    if ($upload.files.length === 0) {
      return;
    }

    mapSource.file = $upload.files[0];
    $name.textContent = mapSource.file.name;
    $name.parentNode.classList.add('uploaded');

    const reader = new FileReader();

    reader.addEventListener('load', async () => {
      if (mapSource.consumer) {
        mapSource.consumer.destroy();
      }
      mapSource.rawContent = reader.result;
      await loadLibrary();
      mapSource.consumer = await new SourceMapConsumer(mapSource.rawContent);
      resolveMap();
    });
    reader.readAsText(mapSource.file);
  });
  $line.addEventListener('input', debounce(() => {
    const line = parseInt($line.value, 10);

    if (Number.isNaN(line)) return;
    if (line === mapSource.line) return;
    mapSource.line = line;
    resolveMap();
  }));
  $column.addEventListener('input', debounce(() => {
    const column = parseInt($column.value, 10);

    if (Number.isNaN(column)) return;
    if (column === mapSource.column) return;
    mapSource.column = column;
    resolveMap();
  }));
  $size.addEventListener('change', () => {
    const size = $size.value === '-1' ? -1 : $size.value;

    if (size === mapSource.size) return;
    mapSource.size = size;
    if (!mapSource.content) return;
    render();
  });

  /** 重新解析 */
  function resolveMap() {
    const { line, column, consumer } = mapSource;

    if (!(column && consumer)) return;

    const result = consumer.originalPositionFor({ line, column });

    if (result.source === null) {
      $resultJson.innerHTML = '<span style="color: red">解析为 null</span>';
      return;
    }
    delete result.name;
    $resultJson.textContent = JSON.stringify(result, null, 4);

    mapSource.content = consumer.sourceContentFor(result.source);
    mapSource.highlightRow = result.line;
    render();
  }
  /** 渲染源代码 */
  function render() {
    const { content, highlightRow, size } = mapSource;
    const $dom = TracebackJS.render(content, { highlightRow, displayRows: size });

    $resultSource.replaceChild($dom, $resultSource.firstElementChild);
  }
}

/** 加载解析与渲染库 */
async function loadLibrary() {
  if (!SourceMapConsumer) {
    // 两个库打包到一起
    const SourceMap = await import('source-map/lib/source-map-consumer' /* webpackChunkName: 'vendors~tools/sourcemap' */);
    TracebackJS = await import('traceback.js' /* webpackChunkName: 'vendors~tools/sourcemap' */);

    TracebackJS = TracebackJS.default;
    SourceMapConsumer = SourceMap.default.SourceMapConsumer;
    SourceMapConsumer.initialize({
      'lib/mappings.wasm': __CDN_LINK_SOURCEMAP_MAPPINGS__,
    });
  }
}
