import './index.less';

import { Ripple } from '../common/plugins';

window.addEventListener('load', () => {
  Ripple.init({ color: 'rgba(0,150,136,0.8)' });
});
