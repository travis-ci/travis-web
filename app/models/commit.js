import Ember from 'ember';
import Model from 'travis/models/model';
import Build from 'travis/models/build';
import { gravatarImage } from 'travis/utils/urls';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

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

  subject: function() {
    return this.get('message').split("\n", 1)[0];
  }.property('message'),

  body: function() {
    var message;
    message = this.get('message');
    if (message.indexOf("\n") > 0) {
      return message.substr(message.indexOf("\n") + 1).trim();
    } else {
      return "";
    }
  }.property('message'),

  authorIsCommitter: function() {
    return this.get('authorName') === this.get('committerName') && this.get('authorEmail') === this.get('committerEmail');
  }.property('authorName', 'authorEmail', 'committerName', 'committerEmail'),

  authorAvatarUrlOrGravatar: function() {
    var url = this.get('authorAvatarUrl');

    if(!url) {
      url = gravatarImage(this.get('authorEmail'), 40);
    }

    return url;
  }.property('authorEmail', 'authorAvatarUrl'),

  committerAvatarUrlOrGravatar: function() {
    var url = this.get('committerAvatarUrl');

    if(!url) {
      url = gravatarImage(this.get('committerEmail'), 40);
    }

    return url;
  }.property('committerEmail', 'committerAvatarUrl')
});
