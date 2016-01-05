import { timeInWords, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  return safe(timeInWords(params[0]));
});
