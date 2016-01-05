import { timeAgoInWords, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  return safe(moment(params[0]).format('MMMM D, YYYY H:mm:ss') || '-');
});
