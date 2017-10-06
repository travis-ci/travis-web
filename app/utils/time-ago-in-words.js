import $ from 'jquery';

const timeago = $.timeago;
timeago.settings.allowFuture = true;

export default function timeAgoInWords(date) {
  if (date) {
    return timeago(date);
  }
}
