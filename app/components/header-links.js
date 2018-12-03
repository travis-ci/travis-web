/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Ember from 'ember';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Component.extend({
  tagName: '',

  config,

  auth: service(),
  features: service(),
  externalLinks: service(),
  helpScout: service(),
  user: alias('auth.currentUser'),

  userName: computed('user.{login,name}', function () {
    let login = this.get('user.login');
    let name = this.get('user.name');
    return name || login;
  }),

  deploymentVersion: computed(function () {
    if (window && window.location) {
      const hostname = window.location.hostname;

      if (hostname.indexOf('ember-beta') === 0 || hostname.indexOf('ember-canary') === 0) {
        return `Ember ${Ember.VERSION}`;
      } else if (hostname.indexOf('test-deployments') > 0) {
        const branchName = hostname.split('.')[0];
        const branchURL = this.get('externalLinks').travisWebBranch(branchName);
        const branchLink = `<a href='${branchURL}'><code>${branchName}</code></a>`;

        return htmlSafe(`Test deployment ${branchLink}`);
      } else {
        return false;
      }
    } else {
      return false;
    }
  }),

  classProfile: computed('tab', 'auth.state', function () {
    let tab = this.get('tab');
    let authState = this.get('auth.state');
    let classes = ['profile menu'];

    if (tab === 'profile') {
      classes.push('active');
    }

    classes.push(authState || 'signed-out');

    return classes.join(' ');
  }),

  actions: {
    helpscoutTrigger() {
      this.helpScout.openHelpScout();
    },

    signIn() {
      return this.get('auth').signIn();
    },

    signOut() {
      return this.get('auth').signOut();
    },
  },
});
