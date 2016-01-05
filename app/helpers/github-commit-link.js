import { formatCommit, safe } from 'travis/utils/helpers';
import { githubCommit as githubCommitUrl } from 'travis/utils/urls';
import Ember from 'ember';

export default Ember.Helper.helper(function(params) {
  var commitSha, sha, slug, url;

  slug = params[0];
  commitSha = params[1];
  if (!commitSha) {
    return '';
  }
  sha = Ember.Handlebars.Utils.escapeExpression(formatCommit(commitSha));
  if (!slug) {
    return sha;
  }
  url = Ember.Handlebars.Utils.escapeExpression(githubCommitUrl(slug, sha));
  return safe('<a class="github-link only-on-hover" href="' + url + '">' + sha + '</a>');
});
