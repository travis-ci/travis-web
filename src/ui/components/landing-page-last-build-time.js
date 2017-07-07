import timeAgoInWords from "travis/src/utils/time-ago-in-words";
import Ember from 'ember';

export const helper = Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(timeAgoInWords(params[0]) || 'currently running');
});
