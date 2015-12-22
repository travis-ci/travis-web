import { safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  var state = params[0];
  if (state === 'received') {
    return 'booting';
  } else {
    return state;
  }
});
