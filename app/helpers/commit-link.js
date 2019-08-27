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

    const commit = escape(formatCommit(commitSha));

    if (!slug) {
      return commit;
    }

    const [owner, repo] = slug.split('/');
    const commitUrl = this.externalLinks.commitUrl(vcsType, { owner, repo, commit });
    const url = escape(commitUrl);
    const string = `<a class="github-link only-on-hover" href="${url}">${commit}</a>`;
    return new htmlSafe(string);
  }
});
