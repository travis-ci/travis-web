import Ember from 'ember';
import Model from 'travis/models/model';
import Build from 'travis/models/build';
import { gravatarImage } from 'travis/utils/urls';
import DS from 'ember-data';

export default Model.extend({
  sha: DS.attr(),
  branch: DS.attr(),
  message: DS.attr(),
  compareUrl: DS.attr(),
  authorName: DS.attr(),
  authorEmail: DS.attr(),
  committerName: DS.attr(),
  committerEmail: DS.attr(),
  committedAt: DS.attr(),
  committerAvatarUrl: DS.attr(),
  authorAvatarUrl: DS.attr(),

  build: DS.belongsTo('build'),

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
