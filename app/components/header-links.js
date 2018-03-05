/* global HS */

import Ember from 'ember';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: '',

  @service auth: null,
  @service features: null,
  @service externalLinks: null,

  @alias('auth.currentUser') user: null,

  @computed('user.{login,name}')
  userName(login, name) {
    return name || login;
  },

  @computed()
  deploymentVersion() {
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
  },

  @computed('tab', 'auth.state')
  classProfile(tab, authState) {
    let classes = ['profile menu'];

    if (this.get('tab') === 'profile') {
      classes.push('active');
    }

    classes.push(authState || 'signed-out');

    return classes.join(' ');
  },

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },

  @action
  signIn() {
    return this.get('auth').signIn();
  },

  @action
  signOut() {
    return this.get('auth').signOut();
  },
});
