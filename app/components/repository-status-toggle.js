import Component from '@ember/component';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import hasErrorWithStatus from 'travis/utils/api-errors';
import { vcsLinks } from 'travis/services/external-links';

export default Component.extend({
  externalLinks: service(),
  accounts: service(),
  user: reads('accounts.user'),
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['repository.active:active'],
  accessSettingsUrl: computed('user.vcsType', 'user.vcsId', function () {
    return this.user && vcsLinks.accessSettingsUrl(this.user.vcsType, { owner: this.user.login });
  }),

  admin: computed('repository.permissions', function () {
    let permissions = this.get('repository.permissions');
    if (permissions) {
      return permissions.admin;
    }
  }),

  comLink: computed('repository.slug', function () {
    let slug = this.get('repository.slug');
    return this.externalLinks.migratedToComLink(slug);
  }),

  onDotOrg: computed('features.{proVersion,enterpriseVersion}', function () {
    let com = this.get('features.proVersion');
    let enterprise = this.get('features.enterpriseVersion');
    return !(com || enterprise);
  }),

  actions: {

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
