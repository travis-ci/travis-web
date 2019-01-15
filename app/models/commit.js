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
    let message = this.get('message');
    if (message) {
      return message.split('\n', 1)[0];
    }
  }),

  body: computed('message', function () {
    let message = this.get('message');
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
      let authorName = this.get('authorName');
      let authorEmail = this.get('authorEmail');
      let committerName = this.get('committerName');
      let committerEmail = this.get('committerEmail');
      return authorName === committerName && authorEmail === committerEmail;
    }
  ),

  githubUrl: computed('build.repo.slug', 'sha', function () {
    let slug = this.get('build.repo.slug');
    let sha = this.get('sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),
});
