import Component from '@ember/component';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';
import hasErrorWithStatus from 'travis/utils/api-errors';

export default Component.extend({
  tagName: 'li',
  classNames: ['profile-repolist-item'],
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
      return this.set('apiError', null);
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
      }, (error) => {
        this.set('apiError', error);
        this.sendAction('onToggleError', repository);
      });
    }
  }),

  @computed('apiError')
  is409error(apiError) {
    return hasErrorWithStatus(apiError, '409');
  }
});
