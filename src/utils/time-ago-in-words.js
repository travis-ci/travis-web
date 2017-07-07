import Ember from 'ember';

const timeago = Ember.$.timeago;
timeago.settings.allowFuture = true;

export default function timeAgoInWords(date) {
  if (date) {
    return timeago(date);
  }
}
