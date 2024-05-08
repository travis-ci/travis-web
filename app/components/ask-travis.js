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
  actions: {
    toggle() {
      console.log("TOGGLE");
      const content = document.getElementById('asktravis-content');
      const btn = document.getElementById('asktravis-button');

      if (this.visible) {

        btn.classList.remove('asktravis-button-active');
        btn.classList.add('asktravis-button-inactive');
      } else {

        btn.classList.remove('asktravis-button-inactive');
        btn.classList.add('asktravis-button-active');
      }
      if (content) {
        if (this.askWindow === null) {
          this.askWindow = new AskCore({backendUrl: "http://", title: 'AskTravis', root: content, clientId: config.aida.clientId, clientKey: config.aida.clientKey, userId: this.user ? this.user.id : ''});
        }
        content.style.display = this.visible ? 'none' : 'block';
      }
      this.visible = !this.visible;
    }
  }
});
