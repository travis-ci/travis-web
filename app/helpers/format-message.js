import { formatMessage as _formatMessage } from 'travis/utils/helpers';
import Ember from 'ember';

export default Ember.Helper.helper(function (params, hash) {
  return new Ember.String.htmlSafe(_formatMessage(params[0], hash));
});
