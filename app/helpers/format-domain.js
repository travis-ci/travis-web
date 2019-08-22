import { helper } from '@ember/component/helper';

export default helper(([url]) => (
  url.indexOf('//') > -1
    ? url.split('/')[2]
    : url.split('/')[0]
));
