import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';

export default Component.extend({
  flashes: service(),

  tagName: 'button',
  classNames: ['switch'],
  classNameBindings: ['active', 'key'],

  attributeBindings: ['aria-checked', 'role'],

  role: 'switch',

  'aria-checked': computed('active', function () {
    if (this.get('active')) {
      return 'true';
    } else {
      return 'false';
    }
  }),

  save: task(function* () {
    try {
      // try saving with the new state, only change local state if successful
      const futureState = !this.get('active');
      yield this.get('repo').saveSetting(this.get('key'), futureState);
      this.toggleProperty('active');
    } catch (e) {
      this.get('flashes').error('There was an error while saving your settings. Please try again.');
    }
  }).drop(),

  click() {
    this.get('save').perform();
  }
});
