import './index.less';

window.addEventListener('load', () => {
  const $developer = document.querySelector('.for-developer');
  const $loading = document.querySelector('.loading');
  const $noResult = document.querySelector('.no-result');
  const $form = document.querySelector('#search');
  let searchText = '';

  /**
   * 此页面的几个级别显示
   * 1. 用户无输入
   * 2. 开发者篡改query
   * 3. 加载中
   * 4. 无结果
   */
  const PageShow = {
    noInput() {
      $developer.classList.add('hidden');
      $loading.classList.add('hidden');
      $noResult.classList.add('no-input');
      $noResult.classList.remove('hidden');
    },
    developer() {
      $loading.classList.add('hidden');
      $noResult.classList.add('hidden');
      $developer.classList.remove('hidden');
    },
    loading() {
      $developer.classList.add('hidden');
      $noResult.classList.add('hidden');
      $loading.classList.remove('hidden');
    },
    noResult() {
      $developer.classList.add('hidden');
      $loading.classList.add('hidden');
      $noResult.classList.remove('no-input');
      $noResult.classList.remove('hidden');
    },
  };

  // 初始化title与输入框
  init();

  /**
   * 当搜索表单提交时
   * 1. 阻止跳转
   * 2. 判断是否与上次输入一致，是则不做任何操作
   * 3. 更改title以及浏览器栏URL
   * 4. 若值为空，提示无输入
   * 5. ajax
   */
  $form.addEventListener('submit', (e) => {
    // Step1
    e.preventDefault();

    const value = $form.q.value.trim();

    // Step2: 输入与上次一致
    if (value === searchText) return;

    searchText = value;
    // Step3: 更改浏览器栏URL
    document.title = `${searchText ? `${searchText}_` : ''}搜索_滔's 博客`;
    window.history.pushState({ q: searchText }, document.title, `?q=${searchText}`);

    if (!searchText) {
      // Step4: 用户未输入字符
      PageShow.noInput();
      return;
    }

    ajax();
  });

  /**
   * 当触发浏览器Histroy改变时
   * 1. 上次无记录，应该是新页面打开/search.html，采取相应处理
   * 2. 取上次搜索值
   * 3. 更改表单输入值与页面title
   * 4. ajax
   */
  window.addEventListener('popstate', (e) => {
    if (!e.state) {
      document.title = '搜索_滔\'s 博客';
      searchText = '';
      $form.q.value = '';
      PageShow.developer();
      return;
    }

    searchText = e.state.q;
    $form.q.value = searchText;
    document.title = `${searchText ? `${searchText}_` : ''}搜索_滔's 博客`;

    if (searchText) ajax();
    else PageShow.noInput();
  });

  /**
   * 当进入或刷新搜索页时
   * 1. 是否匹配到 ?q=xxx，没有提示之
   * 2. 判断搜索字符串是否为空，是则提示无输入
   * 3. 更改表单输入值与页面title
   * 4. ajax
   */
  function init() {
    // HACK: 浏览器把url中空格编码成 +，去除之
    const decodeStr = window.decodeURIComponent(window.location.search).replace(/\+/g, '');
    const search = decodeStr.match(/^(\?|.+&)q=(.*?)(&.+)?$/);

    if (!search) {
      // Step1: 应该是开发者修改query导致不匹配，提示之
      PageShow.developer();
      return;
    }

    searchText = search[2].trim();

    if (!searchText) {
      // Step2: 用户未输入
      PageShow.noInput();
      return;
    };

    // Step3
    document.title = `${searchText}_搜索_滔's 博客`;
    $form.q.value = searchText;
    ajax();
  }

  function ajax() {
    // TODO: 请求数据
    console.info(`开始搜索${searchText}，预计耗时1000ms`)
    PageShow.loading();
    setTimeout(() => {
      PageShow.noResult();
    }, 1000);
  }
});
