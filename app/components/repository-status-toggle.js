import Component from '@ember/component';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'li',
  classNames: [],
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

  @computed('repository.permissions')
  admin(permissions) {
    if (permissions) {
      return permissions.admin;
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
