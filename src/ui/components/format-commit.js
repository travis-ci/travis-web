import formatCommit from "travis/src/utils/format-commit/util";
import Ember from 'ember';

export const helper = Ember.Helper.helper(function (params) {
  var commit;
  commit = params[0];
  if (commit) {
    return new Ember.String.htmlSafe(formatCommit(commit.get('sha'), commit.get('branch')));
  }
});
