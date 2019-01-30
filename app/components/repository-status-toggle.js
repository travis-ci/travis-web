import Component from '@ember/component';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),

  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['repository.active:active'],
  githubOrgsOauthAccessSettingsUrl: config.githubOrgsOauthAccessSettingsUrl,

  admin: computed('repository.permissions', function () {
    let permissions = this.get('repository.permissions');
    if (permissions) {
      return permissions.admin;
    }
  }),
  isNotAdmin: not('admin'),

  comLink: computed('repository.slug', function () {
    let slug = this.get('repository.slug');
    return this.get('externalLinks').migratedToComLink(slug);
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
