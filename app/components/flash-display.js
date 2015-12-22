import Ember from 'ember';

export default Ember.Component.extend({
  flashes: Ember.inject.service(),
  classNames: ['flash'],
  tagName: 'ul',
  messagesBinding: 'flashes.messages',

  actions: {
    closeMessage(msg) {
      return this.get('flashes').close(msg);
    }
  }
});
