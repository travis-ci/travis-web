/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import { VERSION } from '@ember/version';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

export default Component.extend({
  tagName: '',

  config,

  auth: service(),
  router: service(),
  features: service(),
  externalLinks: service(),
  multiVcs: service(),

  deploymentVersion: computed(function () {
    if (window && window.location) {
      const hostname = window.location.hostname;

      if (hostname.indexOf('ember-beta') === 0 || hostname.indexOf('ember-canary') === 0) {
        return `Ember ${VERSION}`;
      } else if (hostname.indexOf('test-deployments') > 0) {
        const branchName = hostname.split('.')[0];
        const branchURL = this.externalLinks.travisWebBranch(branchName);
        const branchLink = `<a href='${branchURL}'><code>${branchName}</code></a>`;

        return htmlSafe(`Test deployment ${branchLink}`);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }),

  actions: {

    goToHelp() {
      if (this.router.currentRouteName !== 'help') {
        const page = encodeURI(window.location.href);
        this.router.transitionTo('help', { queryParams: { page } });
      }
    }

  }

});
