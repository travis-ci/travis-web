import { timeAgoInWords } from 'travis/utils/helpers';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(timeAgoInWords(params[0]) || '-');
});
