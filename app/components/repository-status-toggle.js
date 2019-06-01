import Component from '@ember/component';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
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

  toggleRepositoryTask: task(function* () {
    const repository = this.repository;
    try {
      yield repository.toggle();
      yield repository.reload();
      this.pusher.subscribe(`repo-${repository.id}`);
    } catch (error) {
      this.set('apiError', error);
    }
  }),

  is409error: computed('apiError', function () {
    return hasErrorWithStatus(this.apiError, '409');
  })
});
