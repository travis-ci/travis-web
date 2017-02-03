import { safe } from 'travis/utils/helpers';
import timeInWords from 'travis/utils/time-in-words';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return safe(timeInWords(params[0]));
});
