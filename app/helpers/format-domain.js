import { helper } from '@ember/component/helper';

export default helper(([url]) => {
  if (url.indexOf('//') > -1) {
    return url.split('/')[2];
  } else {
    return url.split('/')[0];
  }
});
