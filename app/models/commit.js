import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Model.extend({
  @service externalLinks: null,

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

  @computed('message')
  subject(message) {
    if (message) {
      return message.split('\n', 1)[0];
    }
  },

  @computed('message')
  body(message) {
    if (message && message.indexOf('\n') > 0) {
      return message.substr(message.indexOf('\n') + 1).trim();
    } else {
      return '';
    }
  },

  @computed('authorName', 'authorEmail', 'committerName', 'committerEmail')
  authorIsCommitter(authorName, authorEmail, committerName, committerEmail) {
    return authorName === committerName && authorEmail === committerEmail;
  },
});
