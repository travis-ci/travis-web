import Ember from 'ember';

export default Ember.Controller.extend({
  flashes: Ember.inject.service(),

  loadFlashes() {
    return this.get('flashes').loadFlashes(...arguments);
  }
});
