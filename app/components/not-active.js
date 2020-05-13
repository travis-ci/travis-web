import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  api: service(),
  auth: service(),
  flashes: service(),
  permissions: service(),
  features: service(),
  externalLinks: service(),

  user: alias('auth.currentUser'),

  config,

  canActivate: computed('repo', 'repo.permissions.admin', function () {
    let repo = this.repo;
    let adminPermissions = this.get('repo.permissions.admin');
    if (repo) {
      return adminPermissions;
    }
    return false;
  }),

  migratedOnOrg: computed(
    'features.{enterpriseVersion,proVersion}',
    'repo.migrationStatus',
    function () {
      let enterprise = this.get('features.enterpriseVersion');
      let pro = this.get('features.proVersion');
      let migrationStatus = this.get('repo.migrationStatus');
      return !enterprise && !pro && migrationStatus === 'migrated';
    }
  ),

  comRepositoryLink: computed('repo.slug', function () {
    let slug = this.get('repo.slug');
    return this.externalLinks.migratedToComLink(slug);
  }),

  githubAppsActivationURL: computed(
    'config.githubApps.appName',
    'repo.owner.github_id',
    'repo.githubId',
    function () {
      let appName = this.get('config.githubApps.appName');
      let ownerGithubId = this.get('repo.owner.github_id');
      let repoGithubId = this.get('repo.githubId');
      return `${config.githubAppsEndpoint}/` +
        `${appName}/installations/new/permissions` +
        `?suggested_target_id=${ownerGithubId}` +
        `&repository_ids=${repoGithubId}`;
    }
  ),

  activate: task(function* () {
    const repoId = this.get('repo.id');

    try {
      const response = yield this.api.post(`/repo/${repoId}/activate`);

      if (response.active) {
        this.pusher.subscribe(`repo-${repoId}`);

        this.repo.set('active', true);
        this.flashes.success('Repository has been successfully activated.');
      }
    } catch (e) {
      this.flashes.error('There was an error while trying to activate the repository.');
    }
  }).drop()
});
