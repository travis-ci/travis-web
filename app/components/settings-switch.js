import Ember from 'ember';

const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  flashes: service(),
  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['active', 'key'],

  save: task(function* () {
    this.toggleProperty('active');

    try {
      yield this.get('repo').saveSetting(this.get('key'), this.get('active'));
    } catch (e) {
      this.get('flashes').error('There was an error while saving settings. Please try again.');
    }
  }).drop(),

  click() {
    this.get('save').perform();
  }
});
