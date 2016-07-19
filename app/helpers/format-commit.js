import { safe, formatCommit as formatCommitHelper } from 'travis/utils/helpers';
import Ember from 'ember';

export default Ember.Helper.helper(params => {
  let commit;
  commit = params[0];
  if (commit) {
    return safe(formatCommitHelper(commit.get('sha'), commit.get('branch')));
  }
});
