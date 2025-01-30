import moment from 'moment';

export function subtractOneDay(date) {
  return moment(date).subtract(1, 'days').format('MMMM D, YYYY');
}
