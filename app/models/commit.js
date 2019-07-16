import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Model.extend({
  externalLinks: service(),

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

  githubUrl: computed('build.repo.slug', 'sha', function () {
    let slug = this.get('build.repo.slug');
    let sha = this.sha;
    return this.externalLinks.githubCommit(slug, sha);
  }),
});
