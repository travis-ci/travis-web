import { timeAgoInWords, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  let date = new Date(params[0]);
  return safe(moment(date).format('MMMM D, YYYY H:mm:ss') || '-');
});
