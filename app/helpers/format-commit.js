import formatCommit from 'travis/utils/format-commit';
import Ember from 'ember';

export default Ember.Helper.helper(function (params) {
  var commit;
  commit = params[0];
  if (commit) {
    return new Ember.String.htmlSafe(formatCommit(commit.get('sha'), commit.get('branch')));
  }
});
