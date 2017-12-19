/* global TravisTracer */

import Component from '@ember/component';
import { action } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'div',
  panelIsOpen: true,
  requests: [],

  init() {
    this._super(...arguments);

    TravisTracer.onRequest = req => {
      this.get('requests').pushObject(req);

      Ember.run.next(() => {
        let panel = document.getElementById('tracer-panel');
        panel.scrollTop = panel.scrollHeight + 20;
      })
    };
  },

  @action
  toggleOpen() {
    this.toggleProperty('panelIsOpen');
  }
});
