import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  flashes: service(),
  classNames: ['flash'],
  tagName: 'ul',
  messagesBinding: 'flashes.messages',

  actions: {
    closeMessage(msg) {
      return this.get('flashes').close(msg);
    }
  }
});
