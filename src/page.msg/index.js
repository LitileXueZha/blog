import './index.less';
import { Ripple } from '../common/plugins';

window.addEventListener('load', () => {
  Ripple.init();

  document.getElementById('form-msg').addEventListener('submit', (e) => {
    e.preventDefault();
  });
});
