import timeInWords from 'travis/utils/time-in-words';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(timeInWords(params[0]));
});
