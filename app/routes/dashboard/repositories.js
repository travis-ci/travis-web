import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';
import config from 'travis/config/environment';
import { alias } from 'ember-decorators/object/computed';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    },
    page: {
      refreshModel: true
    }
  },

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('index');
    }
  },

  @alias('config.pagination.dashboardReposPerPage') recordsPerPage: null,

  model(params) {
    const offset = (params.page - 1) * this.get('recordsPerPage');
    return hash({
      starredRepos: this.store.filter('repo', {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      }, (repo) => repo.get('starred'), ['starred'], true),
      repos: this.store.paginated('repo', {
        active: true,
        sort_by: 'current_build:desc',
        offset,
        limit: this.get('recordsPerPage'),
      }, {
        filter: (repo) => repo.get('active') && repo.get('isCurrentUserACollaborator'),
        sort: dashboardRepositoriesSort,
        dependencies: ['active', 'isCurrentUserACollaborator'],
        forceReload: true
      }),
      accounts: this.store.filter('account', {
        all: true
      }, () => true, [], true)
    });
  },

  afterModel(model) {
    const repos = model.repos;

    // This preloads related models to prevent a backtracking rerender error.
    return hash({
      currentBuilds: repos.map(repo => repo.get('currentBuild')),
      defaultBranches: repos.map(repo => repo.get('defaultBranch'))
    });
  }
});
