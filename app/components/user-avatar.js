import Ember from 'ember';
import computed from 'ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'span',
  classNameBindings: ['small:avatar--small:avatar'],

  @computed('name')
  userInitials(name) {
    if (name) {
      let arr = name.split(' ');
      let initials = '';

      if (arr.length >= 2) {
        initials = arr[0].split('')[0] + arr[1].split('')[0];
      } else {
        initials = arr[0].split('')[0];
      }
      return initials;
    }
  },

  @computed('url', 'size')
  avatarUrl(url, size) {
    if (!size) {
      size = 32;
    }
    const sizeParam = `&s=${size}`;
    if (url.includes('?v=3')) {
      return `${url}${sizeParam}`;
    } else {
      return `${url}?v=3&s=${size}`;
    }
  },

  @computed('url', 'size')
  highResAvatarUrl(url, size) {
    if (!size) {
      size = 32;
    }
    size = size * 2; // high-dpi
    const sizeParam = `&s=${size}`;
    if (url.includes('?v=3')) {
      return `${url}${sizeParam}`;
    } else {
      return `${url}?v=3&s=${size}`;
    }
  }
});
