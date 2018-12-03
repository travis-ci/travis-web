import { htmlSafe } from '@ember/string';
import Helper from '@ember/component/helper';
import formatCommit from 'travis/utils/format-commit';
import { inject as service } from '@ember/service';

import Ember from 'ember';
const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Helper.extend({
  externalLinks: service(),

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
