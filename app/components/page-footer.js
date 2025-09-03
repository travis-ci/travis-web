/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Component.extend({
  router: service(),
  auth: service(),
  features: service(),

  config,

  tagName: 'footer',
  classNames: ['footer'],

  aidaEnabled: !config.disableAida,

  actions: {
    goToLicensing(evt) {
      if (this.router.currentRouteName === 'licensing') {
        evt?.preventDefault?.();
        // Snap to top instantly
        const html = document.documentElement;
        const body = document.body;
        const prevHtml = html.style.scrollBehavior;
        const prevBody = body.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        body.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        html.style.scrollBehavior = prevHtml;
        body.style.scrollBehavior = prevBody;
      }
    }
  },

  currentYear() {
    return new Date().getFullYear();
  }
});
