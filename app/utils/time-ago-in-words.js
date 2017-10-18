import timeago from 'npm:timeago.js';

const timeagoInstance = timeago();

export default function timeAgoInWords(date) {
  if (date) {
    return timeagoInstance.format(date);
  }
}
