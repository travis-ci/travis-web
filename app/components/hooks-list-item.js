import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['row'],
  classNameBindings: ['hook.active:active'],
  githubOrgsOauthAccessSettingsUrl: config.githubOrgsOauthAccessSettingsUrl,

  actions: {
    handleToggleError() {
      return this.set("showError", true);
    },

    close() {
      return this.send('resetErrors');
    },

    resetErrors() {
      return this.set("showError", false);
    }
  }
});
