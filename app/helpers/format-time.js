import { timeAgoInWords, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  return safe(timeAgoInWords(params[0]) || '-');
});
