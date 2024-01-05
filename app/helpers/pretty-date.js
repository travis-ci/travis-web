import { htmlSafe } from '@ember/template';

import { helper } from '@ember/component/helper';

import moment from 'moment';

export function prettyDate(params) {
  let date = new Date(params[0]);
  const theMoment = moment(date).format('MMMM D, YYYY H:mm:ss') || '-';

  return new htmlSafe(`${theMoment}`);
}

export default helper(prettyDate);
