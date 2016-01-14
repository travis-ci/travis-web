import Ember from 'ember';
import config from 'travis/config/environment';
import {gravatarImage} from '../utils/urls';

export default Ember.Component.extend({

  tagName: 'span',
  classNames: ['avatar'],

  gravatarUrl: function() {
    if (!this.get('isAuthor') && !this.get('isComitter')) {
      if (this.get('user.type') === 'organization') {
        return this.get('user.avatarUrl');
      } else {
          return gravatarImage(this.get('user.email'), 36);
      }
    } else {
        if (this.get('isAuthor')) {
            return this.user.get('authorAvatarUrlOrGravatar');
        } else if (this.get('isCommitter')) {
            return this.user.get('committerAvatarUrlorGravatar');
       }
    }
  }.property('gravatarUrl'),

  userInitials: function() {
    var name = this.get('user.name') || this.get('user.login') ||
              this.get('user.authorName') || this.get('user.committerName');
    var arr = name.split(' ');
    var initials;

    if (arr.length >= 2) {
      initials = arr[0].split('')[0] + arr[1].split('')[0];
    } else {
      initials = arr[0].split('')[0];
    }
      return initials.toUpperCase();
  }.property('userInitials')

});
