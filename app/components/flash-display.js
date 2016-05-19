import Ember from 'ember';

const { alias } = Ember.computed;
const { service } = Ember.inject;

export default Ember.Component.extend({
  flashes: service(),
  classNames: ['flash'],
  tagName: 'ul',
  messages: alias('flashes.messages'),

  actions: {
    closeMessage(msg) {
      return this.get('flashes').close(msg);
    }
  }
});
