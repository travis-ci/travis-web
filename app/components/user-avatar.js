import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',
  classNameBindings: ['small:avatar--small:avatar'],

  userInitials: Ember.computed('userInitials', function () {
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
    } else {
      return '';
    }
  })
});
