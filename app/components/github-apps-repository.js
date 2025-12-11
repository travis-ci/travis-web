/* global Travis */
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
import { capitalize } from '@ember/string';

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

  repositoryProvider: computed('repository.provider', function () {
    return capitalize(this.repository.provider);
  }),

  repositoryType: computed('repository.serverType', function () {
    switch (this.repository.serverType) {
      case 'git':
        return 'GIT';
      case 'svn':
        return 'SVN';
      case 'perforce':
        return 'P4';
    }
  }),

  accessSettingsUrl: computed('user.vcsType', 'user.vcsId', function () {
    return this.user && vcsLinks.accessSettingsUrl(this.user.vcsType, { owner: this.user.login });
  }),

  hasActivatePermission: computed('permissions.all', 'repository', function () {
    let repo = this.repository;
    let forRepo = (repo.owner.id == this.user.id && repo.ownerType == 'user') ||
                  ((repo.shared || repo.ownerType != 'user') && repo.permissions?.activate);
    return forRepo;
  }),

  hasSettingsPermission: computed('permissions.all', 'repository', function () {
    let repo = this.repository;
    let forRepo = (repo.owner.id == this.user.id && repo.ownerType == 'user') ||
                  ((repo.shared || repo.ownerType != 'user') && repo.permissions?.settings_read);
    return forRepo && this.permissions.hasPushPermission(repo);
  }),

  hasEmailSubscription: computed('repository', 'repository.emailSubscribed', function () {
    return this.repository.emailSubscribed;
  }),

  emailSubscriptionDescription: computed('repository', 'repository.emailSubscribed', function () {
    return `${this.repository.emailSubscribed ? 'Disable ' : 'Enable '} build mails for ${this.repository.name}`;
  }),

  toggleRepositoryEmailSubscription: task(function* () {
    const repository = this.repository;
    try {
      if (repository.emailSubscribed) {
        yield repository.unsubscribe.perform();
      } else {
        yield repository.subscribe.perform();
      }
      yield repository.reload();
    } catch (error) {
      this.set('apiError', error);
    }
  }),

  toggleRepositoryTask: task(function* () {
    const repository = this.repository;
    try {
      yield repository.toggle();
      yield repository.reload();
      Travis.pusher.subscribe(`repo-${repository.id}`);
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
