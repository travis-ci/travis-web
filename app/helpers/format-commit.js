import { safe, formatCommit as formatCommitHelper } from 'travis/utils/helpers';
import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  var commit;
  commit = params[0];
  if (commit) {
    return safe(formatCommitHelper(commit.get('sha'), commit.get('branch')));
  }
});
