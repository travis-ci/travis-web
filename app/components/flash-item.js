import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['type'],

  type: Ember.computed('flash.type', function () {
    return this.get('flash.type') || 'broadcast';
  }),

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  }
});
