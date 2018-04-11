import { computed, action } from 'ember-decorators/object';
import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

import { filter, filterBy } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service features: null,

  page: 1,

  @computed('model.deprecated')
  sortedRepositories(repos) {
    return repos.sortBy('name');
  },

  showGitHubApps: config.githubApps,

  // FIXME this is quite baroque to avoid trying to load an installation ugh
  @computed('account.id')
  hasGitHubAppsInstallation() {
    if (this.get('account').belongsTo('installation').id()) {
      return true;
    } else {
      return false;
    }
  },

  @filterBy('model.githubApps', 'active_on_org')
  lockedGithubAppsRepositories: null,

  @filter('model.githubApps', repo => !repo.get('active_on_org'))
  notLockedGithubAppsRepositories: null,

  @action
  filterQuery(query) {
    return this.get('store')
      .query('repo', {
        slug_filter: query,
        sort_by: 'slug_filter:desc',
        limit: 10,
        custom: {
          owner: this.get('login'),
          type: 'byOwner',
        },
      });
  },
});
