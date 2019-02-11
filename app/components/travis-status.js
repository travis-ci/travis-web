import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads, notEmpty, not, and } from '@ember/object/computed';

export default Component.extend({
  classNames: ['travis-status'],
  classNameBindings: ['indicator', 'colorizeText:colorize-text'],

  appLoading: service(),

  colorizeText: false,

  indicator: reads('appLoading.indicator'),
  description: reads('appLoading.description'),

  showDescription: notEmpty('description'),
  notShowDescription: not('showDescription'),

  // there is description but it's hidden from outside
  showTooltip: and('notShowDescription', 'description'),

  didInsertElement() {
    this._super(...arguments);
    this.appLoading.fetchTravisStatus.perform();
  }
});
