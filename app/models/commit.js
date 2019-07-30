import Model, { attr, belongsTo } from 'ember-data/model';
import { computed } from '@ember/object';

import vcsLinks from 'travis/utils/vcs-links';

export default Model.extend({
  sha: attr(),
  branch: attr(),
  message: attr(),
  compareUrl: attr(),
  authorName: attr(),
  authorEmail: attr(),
  committerName: attr(),
  committerEmail: attr(),
  committedAt: attr(),
  committerAvatarUrl: attr(),
  authorAvatarUrl: attr(),

  build: belongsTo('build'),

  subject: computed('message', function () {
    let message = this.message;
    if (message) {
      return message.split('\n', 1)[0];
    }
  }),

  body: computed('message', function () {
    let message = this.message;
    if (message && message.indexOf('\n') > 0) {
      return message.substr(message.indexOf('\n') + 1).trim();
    } else {
      return '';
    }
  }),

  authorIsCommitter: computed(
    'authorName',
    'authorEmail',
    'committerName',
    'committerEmail',
    function () {
      let authorName = this.authorName;
      let authorEmail = this.authorEmail;
      let committerName = this.committerName;
      let committerEmail = this.committerEmail;
      return authorName === committerName && authorEmail === committerEmail;
    }
  ),

  githubUrl: computed('build.repo.{slug,vcsType}', 'sha', function () {
    const slug = this.get('build.repo.slug');
    const sha = this.get('sha');
    const vcsType = this.get('build.repo.vcsType');

    return vcsLinks.commitUrl(vcsType, slug, sha);
  }),
});
