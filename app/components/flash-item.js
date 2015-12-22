import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['type'],

  type: function() {
    return this.get('flash.type') || 'broadcast';
  }.property('flash.type'),

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  }
});
