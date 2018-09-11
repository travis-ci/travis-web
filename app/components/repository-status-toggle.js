import Component from '@ember/component';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['repository.active:active'],
  githubOrgsOauthAccessSettingsUrl: config.githubOrgsOauthAccessSettingsUrl,

  @computed('repository.permissions')
  admin(permissions) {
    if (permissions) {
      return permissions.admin;
    }
  },

  actions: {

    close() {
      return this.send('resetErrors');
    },

    resetErrors() {
      return this.set('showError', false);
    }

  },

  toggleRepositoryTask: task(function* () {
    const repository = this.repository;
    try {
      yield repository.toggle();
      yield repository.reload();
      this.pusher.subscribe(`repo-${repository.id}`);
    } catch (error) {
      this.set('showError', true);
    }
  }),
});
