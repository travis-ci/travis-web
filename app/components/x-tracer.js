/* global TravisTracer, window */

import Component from '@ember/component';
import { action } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'div',
  panelIsOpen: false,
  requests: [],

  init() {
    this._super(...arguments);

    if (window.localStorage.TravisTracerIsOpen) {
      this.panelIsOpen = true;
    }

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
    if (this.get('panelIsOpen')) {
      window.localStorage.TravisTracerIsOpen = 'true';
    } else {
      delete window.localStorage.TravisTracerIsOpen;
    }
  }
});
