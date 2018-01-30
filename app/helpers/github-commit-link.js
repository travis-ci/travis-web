import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import formatCommit from 'travis/utils/format-commit';
import { service } from 'ember-decorators/service';

import Ember from 'ember';
const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default helper.extend({
  @service externalLinks: null,

  compute([slug, commitSha]) {
    if (!commitSha) {
      return '';
    }

    const sha = escape(formatCommit(commitSha));

    if (!slug) {
      return sha;
    }

    const commitUrl = this.get('externalLinks').githubCommit(slug, sha);
    const url = escape(commitUrl);
    const string = `<a class="github-link only-on-hover" href="${url}">${sha}</a>`;
    return new htmlSafe(string);
  }
});
