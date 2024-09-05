/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "config" }]*/

import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import  { AskCore } from 'asktravis';
import { alias } from '@ember/object/computed';

export default Component.extend({
  router: service(),
  auth: service(),
  features: service(),
  visible: false,
  askWindow: null,
  user: alias('auth.currentUser'),

  config,

  tagName: 'AskTravis',
  classNames: ['AskTravis'],

  didInsertElement() {
    this._super(...arguments);

    const neverShowAgain = localStorage.getItem('askTravisNeverShowAgain');

    if (!neverShowAgain) {
      document.getElementById('ask-travis-message').style.display = 'flex';
    } else {
      document.getElementById('ask-travis-message').style.display = 'none';
    }

    document.getElementById('close-ask-travis').addEventListener('click', () => {
      this.closeMessage();
    });
  },

  actions: {
    toggle() {
      console.log('TOGGLE');
      const content = document.getElementById('asktravis-content');
      const btn = document.getElementById('asktravis-button');
      document.getElementById('ask-travis-message').style.display = 'none';

      if (this.visible) {
        btn.classList.remove('asktravis-button-active');
        btn.classList.add('asktravis-button-inactive');
      } else {
        btn.classList.remove('asktravis-button-inactive');
        btn.classList.add('asktravis-button-active');
      }
      if (content) {
        if (this.askWindow === null) {
          this.askWindow = new AskCore({backendUrl: 'http://', title: 'AskTravis', root: content, clientId: config.aida.clientId, clientKey: config.aida.clientKey, userId: this.user ? this.user.id : ''});
        }
        content.style.display = this.visible ? 'none' : 'block';
      }
      this.visible = !this.visible;
    }
  },

  closeMessage() {
    document.getElementById('ask-travis-message').style.display = 'none';

    let closeCount = localStorage.getItem('askTravisCloseCount') || 0;
    closeCount = parseInt(closeCount, 10) + 1;
    localStorage.setItem('askTravisCloseCount', closeCount);

    if (closeCount >= 3) {
      localStorage.setItem('askTravisNeverShowAgain', 'true');
    }
  }
});
