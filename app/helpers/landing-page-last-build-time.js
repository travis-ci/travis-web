import timeAgoInWords from 'travis/utils/time-ago-in-words';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(timeAgoInWords(params[0]) || 'currently running');
});
