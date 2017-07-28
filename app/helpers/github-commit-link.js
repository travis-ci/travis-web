import formatCommit from 'travis/utils/format-commit';
import Ember from 'ember';
import { service } from 'ember-decorators/service';

export default Ember.Helper.extend({
  @service externalLinks: null,

  compute([slug, commitSha]) {
    if (!commitSha) {
      return '';
    }

    const sha = Ember.Handlebars.Utils.escapeExpression(formatCommit(commitSha));

    if (!slug) {
      return sha;
    }

    const commitUrl = this.get('externalLinks').githubCommit(slug, sha);
    const url = Ember.Handlebars.Utils.escapeExpression(commitUrl);
    const string = `<a class="github-link only-on-hover" href="${url}">${sha}</a>`;
    return new Ember.String.htmlSafe(string);
  }
});
