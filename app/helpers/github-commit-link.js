import { formatCommit, safe } from 'travis/utils/helpers';
import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Helper.extend({
  urls: service(),

  compute([slug, commitSha]) {
    if (!commitSha) {
      return '';
    }

    const sha = Ember.Handlebars.Utils.escapeExpression(formatCommit(commitSha));

    if (!slug) {
      return sha;
    }

    const url = Ember.Handlebars.Utils.escapeExpression(this.get('urls').githubCommit(slug, sha));
    return safe('<a class="github-link only-on-hover" href="' + url + '">' + sha + '</a>');
  }
});
