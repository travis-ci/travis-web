import Ember from 'ember';
import Model from 'ember-data/model';
import { gravatarImage } from 'travis/utils/urls';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  committer: attr(),
  sha: attr(),
  branch: attr(),
  message: attr(),
  compareUrl: attr(),
  author: attr(),
  authorEmail: attr(),
  committerEmail: attr(),
  committedAt: attr(),
  authorAvatarUrl: attr(),

  build: belongsTo('build'),

  subject: Ember.computed('message', function () {
    return this.get('message').split('\n', 1)[0];
  }),

  body: Ember.computed('message', function () {
    var message;
    message = this.get('message');
    if (message.indexOf('\n') > 0) {
      return message.substr(message.indexOf('\n') + 1).trim();
    } else {
      return '';
    }
  }),

  authorName: Ember.computed.alias('author.name'),
  committerName: Ember.computed.alias('committer.name'),
  committerAvatarUrl: Ember.computed.alias('committer.avatar_url'),

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
    var url = this.get('authorAvatarUrl');

    if (!url) {
      url = gravatarImage(this.get('authorEmail'), 40);
    }

    return url;
  }),

  committerAvatarUrlOrGravatar: Ember.computed('committerEmail', 'committerAvatarUrl', function () {
    var url = this.get('committerAvatarUrl');
    console.log('url', url);

    if (!url) {
      url = gravatarImage(this.get('committerEmail'), 40);
    }

    return url;
  })
});
