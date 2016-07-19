import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',
  classNameBindings: ['small:avatar--small:avatar'],

  userInitials: Ember.computed('userInitials', function () {
    const name = this.get('name');
    const arr = name.split(' ');
    let initials = '';

    if (arr.length >= 2) {
      initials = arr[0].split('')[0] + arr[1].split('')[0];
    } else {
      initials = arr[0].split('')[0];
    }
    return initials;
  })

});
