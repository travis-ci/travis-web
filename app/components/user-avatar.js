import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',
  classNameBindings: ['small:avatar--small:avatar'],

  userInitials: Ember.computed('name', function () {
    let name = this.get('name');
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
  }),

  avatarUrl: Ember.computed('url', 'size', function () {
    const url = this.get('url');
    const size = this.get('size');

    if (size) {
      const sizeParam = `&s=${size}`;
      // ensure version and size set properly
      if (url.includes('?v=3')) {
        return `${url}${sizeParam}`;
      } else {
        return `${url}?v=3&s=${size}`;
      }
    } else {
      return url;
    }
  }),
});
