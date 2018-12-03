import $ from 'jquery';
import Component from '@ember/component';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  auth: service(),
  flashes: service(),
  permissions: service(),
  features: service(),
  externalLinks: service(),

  user: alias('auth.currentUser'),

  config,

  canActivate: computed('repo', 'repo.permissions.admin', function () {
    let repo = this.get('repo');
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
    return this.get('externalLinks').migratedToComLink(slug);
  }),

  githubAppsActivationURL: computed(
    'config.githubApps.appName',
    'repo.owner.github_id',
    'repo.githubId',
    function () {
      let appName = this.get('config.githubApps.appName');
      let ownerGithubId = this.get('repo.owner.github_id');
      let repoGithubId = this.get('repo.githubId');
      return 'https://github.com/apps/' +
        `${appName}/installations/new/permissions` +
        `?suggested_target_id=${ownerGithubId}` +
        `&repository_ids=${repoGithubId}`;
    }
  ),

  activate: task(function* () {
    const apiEndpoint = config.apiEndpoint;
    const repoId = this.get('repo.id');

    try {
      const response = yield $.ajax(`${apiEndpoint}/repo/${repoId}/activate`, {
        headers: {
          Authorization: `token ${this.get('auth.token')}`,
          'Travis-API-Version': '3'
        },
        method: 'POST'
      });

      if (response.active) {
        this.get('pusher').subscribe(`repo-${repoId}`);

        this.get('repo').set('active', true);
        this.get('flashes').success('Repository has been successfully activated.');
      }
    } catch (e) {
      this.get('flashes').error('There was an error while trying to activate the repository.');
    }
  }).drop()
});
