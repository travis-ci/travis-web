import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['type', 'topBarVisible:below-top-bar:fixed'],

  flashes: Ember.inject.service(),

  type: Ember.computed('flash.type', function () {
    return this.get('flash.type') || 'broadcast';
  }),

  topBarVisible: Ember.computed.alias('flashes.topBarVisible'),

  actions: {
    close() {
      return this.attrs.close(this.get('flash'));
    }
  }
});
