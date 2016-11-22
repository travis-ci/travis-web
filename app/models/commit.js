import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

const { service } = Ember.inject;

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

  subject: Ember.computed('message', function () {
    if (this.get('message')) {
      return this.get('message').split('\n', 1)[0];
    }
  }),

  body: Ember.computed('message', function () {
    let message = this.get('message');
    if (message && message.indexOf('\n') > 0) {
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
    var url = this.get('authorAvatarUrl');

    if (!url) {
      url = this.get('externalLinks').gravatarImage(this.get('authorEmail'), 40);
    }

    return url;
  }),

  committerAvatarUrlOrGravatar: Ember.computed('committerEmail', 'committerAvatarUrl', function () {
    var url = this.get('committerAvatarUrl');

    if (!url) {
      url = this.get('externalLinks').gravatarImage(this.get('committerEmail'), 40);
    }

    return url;
  })
});
