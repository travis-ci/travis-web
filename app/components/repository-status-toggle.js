import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['row'],
  classNameBindings: ['repository.active:active'],
  githubOrgsOauthAccessSettingsUrl: config.githubOrgsOauthAccessSettingsUrl,

  actions: {
    handleToggleError() {
      return this.set('showError', true);
    },

    close() {
      return this.send('resetErrors');
    },

    resetErrors() {
      return this.set('showError', false);
    }
  },


  toggleRepositoryTask: task(function* () {
    if (!this.get('disabled')) {
      this.sendAction('onToggle');

      let repository = this.get('repository');

      let pusher = this.get('pusher'),
        repoId = repository.get('id');

      yield repository.toggle().then(() => {
        pusher.subscribe(`repo-${repoId}`);
        this.toggleProperty('repository.active');
      }, () => { this.sendAction('onToggleError', repository); });
    }
  }),
});
