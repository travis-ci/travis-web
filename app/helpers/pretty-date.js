import { htmlSafe } from '@ember/template';

import { helper } from '@ember/component/helper';

import moment from 'moment';

export function prettyDate(params) {
  let date = new Date(params[0]);
  const showTime = params[1] === undefined ? true : params[1];
  return new htmlSafe(moment(date).format(showTime ? 'MMMM D, YYYY H:mm:ss' : 'MMMM D, YYYY') || '-');
}

export default helper(prettyDate);
