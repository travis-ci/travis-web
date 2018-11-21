import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { reads, notEmpty } from '@ember/object/computed';

export default Component.extend({
  classNames: ['travis-status'],
  classNameBindings: ['indicator', 'colorizeText:colorize-text'],

  @service appLoading: null,

  colorizeText: false,

  indicator: reads('appLoading.indicator'),
  description: reads('appLoading.description'),

  showDescription: notEmpty('description'),

  didInsertElement() {
    this._super(...arguments);
    this.appLoading.fetchTravisStatus.perform();
  }
});
