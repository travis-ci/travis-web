import { formatMessage as _formatMessage, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params, hash) {
  return safe(_formatMessage(params[0], hash));
});
