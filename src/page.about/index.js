import './index.less';

window.addEventListener('load', () => {
  // 查看与显示照片
  const $showBtn = document.querySelector('#showPhoto');
  const $photo = document.querySelector('#showPhoto + img');
  let showing = false;

  // 点击按钮显示
  $showBtn.addEventListener('click', () => {
    if (showing) return;

    showing = true;
    // 懒加载
    $photo.src = $photo.dataset.src;
    $showBtn.classList.add('hidden');
    $photo.classList.remove('hidden');
  });
  // 点击图片隐藏
  $photo.addEventListener('click', () => {
    if (!showing) return;

    showing = false;
    $showBtn.classList.remove('hidden');
    $photo.classList.add('hidden');
  });
});
