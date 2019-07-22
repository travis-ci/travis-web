/* global TravisTracer, window */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import { next } from '@ember/runloop';
import Component from '@ember/component';
import config from 'travis/config/environment';

export default Component.extend({
  tagName: 'div',
  panelIsOpen: false,
  config,

  init() {
    this._super(...arguments);

    if (window.localStorage.TravisTracerIsOpen) {
      this.panelIsOpen = true;
    }

    TravisTracer.onRequest = req => {
      this.requests.pushObject(req);
      this.ensurePanelScrolledToBottom();
    };
    this.requests = [];
  },

  actions: {
    toggleOpen() {
      this.toggleProperty('panelIsOpen');
      this.rememberPanelOpenState();
      this.ensurePanelScrolledToBottom();
    }
  },

  ensurePanelScrolledToBottom() {
    next(() => {
      let panel = document.getElementById('tracer-panel');
      panel.scrollTop = panel.scrollHeight + 20;
    });
  },

  rememberPanelOpenState() {
    if (this.panelIsOpen) {
      window.localStorage.TravisTracerIsOpen = 'true';
    } else {
      delete window.localStorage.TravisTracerIsOpen;
    }
  }
});
