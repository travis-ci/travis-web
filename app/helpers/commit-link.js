import Ember from 'ember';
import { htmlSafe } from '@ember/string';
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import formatCommit from 'travis/utils/format-commit';

const { escapeExpression: escape } = Ember.Handlebars.Utils;

export default Helper.extend({
  externalLinks: service(),

  compute([vcsType, slug, commitSha]) {
    if (!commitSha) {
      return '';
    }

    const sha = escape(formatCommit(commitSha));

    if (!slug) {
      return sha;
    }

    const commitUrl = this.externalLinks.commitUrl(vcsType, slug, sha);
    const url = escape(commitUrl);
    const string = `<a class="github-link only-on-hover" href="${url}">${sha}</a>`;
    return new htmlSafe(string);
  }
});
