import moment from 'moment';

moment.updateLocale('en', { relativeTime: {
  future: '%s from now',
  past: '%s ago',
  s: 'less than a minute',
  m: 'about a minute',
  mm: '%d minutes',
  h: 'about an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  M: 'about a month',
  MM: '%d months',
  y: 'about a year',
  yy: '%d years'
}});
moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 24);
moment.relativeTimeThreshold('d', 29);

export default function timeAgoInWords(time) {
  if (time) {
    return moment(time).fromNow();
  }
}
