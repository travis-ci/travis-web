import { formatSha as _formatSha, safe } from 'travis/utils/helpers';
import Ember from "ember";

export default Ember.Helper.helper(function(params) {
  return safe(_formatSha(params[0]));
});
