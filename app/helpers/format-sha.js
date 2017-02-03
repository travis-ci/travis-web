import { formatSha as _formatSha } from 'travis/utils/helpers';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(_formatSha(params[0]));
});
