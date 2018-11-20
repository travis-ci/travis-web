import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['travis-status'],
  classNameBindings: ['status', 'colorizeText:colorize-text'],

  @service appLoading: null,

  colorizeText: false,

  status: reads('appLoading.fetchTravisStatus.last.value'),

  didInsertElement() {
    this._super(...arguments);
    this.appLoading.fetchTravisStatus.perform();
  }
});
