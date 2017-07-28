import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service flashes: null,

  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['active', 'key'],

  save: task(function* () {
    this.toggleProperty('active');

    try {
      yield this.get('repo').saveSetting(this.get('key'), this.get('active'));
    } catch (e) {
      this.get('flashes').error('There was an error while saving your settings. Please try again.');
    }
  }).drop(),

  click() {
    this.get('save').perform();
  }
});
