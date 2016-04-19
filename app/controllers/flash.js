import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Controller.extend({
  flashes: service(),

  loadFlashes() {
    return this.get('flashes').loadFlashes(...arguments);
  }
});
