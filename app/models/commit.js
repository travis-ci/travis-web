import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

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

  externalLinks: service(),

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

  url: computed('build.repo.{ownerName,vcsName,vcsType}', 'sha', function () {
    const owner = this.get('build.repo.ownerName');
    const repo = this.get('build.repo.vcsName');
    const vcsType = this.get('build.repo.vcsType');
    const commit = this.get('sha');

    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit });
  }),
});
