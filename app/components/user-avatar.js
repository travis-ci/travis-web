import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'span',
  classNameBindings: ['small:avatar--small:avatar'],

  userInitials: function() {
    var name = this.get('name');
    var arr = name.split(' ');
    var initials = '';

    if (arr.length >= 2) {
      initials = arr[0].split('')[0] + arr[1].split('')[0];
    } else {
      initials = arr[0].split('')[0];
    }
      return initials;
  }.property('userInitials')

});
