import './index.less';
import '../common/common.less';


import { Ripple } from '../common/common';

window.addEventListener('load', () => {
  Ripple.init({ color: 'rgba(0,150,136,0.8)' });
});
