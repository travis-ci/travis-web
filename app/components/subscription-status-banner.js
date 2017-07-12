import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'p',
  classNameBindings: ['bannerColor'],
  bannerColor: function () {
    return `notice-banner--${this.color}`;
  }.property('bannerColor')
});
