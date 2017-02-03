import formatSha from 'travis/utils/format-sha';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  return new Ember.String.htmlSafe(formatSha(params[0]));
});
