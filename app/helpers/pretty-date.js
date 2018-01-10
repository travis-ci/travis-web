import { htmlSafe } from '@ember/string';

import { helper } from '@ember/component/helper';

import moment from 'moment';

export function prettyDate(params) {
  let date = new Date(params[0]);
  return new htmlSafe(moment(date).format('MMMM D, YYYY H:mm:ss') || '-');
}

export default helper(prettyDate);
