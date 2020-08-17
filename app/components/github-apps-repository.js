import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import {
  match,
  reads,
  not
} from '@ember/object/computed';
import hasErrorWithStatus from 'travis/utils/api-errors';
import { task } from 'ember-concurrency';
import { vcsLinks } from 'travis/services/external-links';

export default Component.extend({
  accounts: service(),
  permissions: service(),
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['migratable'],

  user: reads('accounts.user'),
  vcsType: reads('user.vcsType'),
  isMatchGithub: match('vcsType', /Github\S+$/),
  isNotMatchGithub: not('isMatchGithub'),

  accessSettingsUrl: computed('user.vcsType', 'user.vcsId', function () {
    return this.user && vcsLinks.accessSettingsUrl(this.user.vcsType, { owner: this.user.login });
  }),

  hasSettingsPermission: computed('permissions.all', 'repository', function () {
    let repo = this.repository;
    return this.permissions.hasPushPermission(repo);
  }),

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
  }),

  actions: {

    close() {
      return this.send('resetErrors');
    },

    resetErrors() {
      return this.set('apiError', null);
    }
  },
});
