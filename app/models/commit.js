import Ember from 'ember';
import Model from 'ember-data/model';
import { gravatarImage } from 'travis/utils/urls';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

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

  subject: Ember.computed('message', function () {
    return this.get('message').split('\n', 1)[0];
  }),

  body: Ember.computed('message', function () {
    let message;
    message = this.get('message');
    if (message.indexOf('\n') > 0) {
      return message.substr(message.indexOf('\n') + 1).trim();
    } else {
      return '';
    }
  }),

  authorIsCommitter: Ember.computed(
    'authorName',
    'authorEmail',
    'committerName',
    'committerEmail',
    function () {
      let namesMatch = this.get('authorName') === this.get('committerName');
      let emailsMatch = this.get('authorEmail') === this.get('committerEmail');
      return namesMatch && emailsMatch;
    }
  ),

  authorAvatarUrlOrGravatar: Ember.computed('authorEmail', 'authorAvatarUrl', function () {
    let url = this.get('authorAvatarUrl');

    if (!url) {
      url = gravatarImage(this.get('authorEmail'), 40);
    }

    return url;
  }),

  committerAvatarUrlOrGravatar: Ember.computed('committerEmail', 'committerAvatarUrl', function () {
    let url = this.get('committerAvatarUrl');

    if (!url) {
      url = gravatarImage(this.get('committerEmail'), 40);
    }

    return url;
  })
});
