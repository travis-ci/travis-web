import { helper } from '@ember/component/helper';
import { prettyDate } from 'travis/helpers/pretty-date';


export function conditionalTitle([conditionalTime, str, time]) {
  if (conditionalTime) {
    return `${str} ${prettyDate([time])}`;
  }
  return '';
}

export default helper(conditionalTitle);
