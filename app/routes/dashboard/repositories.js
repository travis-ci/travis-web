import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  features: service(),
  accounts: service(),
  store: service(),

  queryParams: {
    page: {
      refreshModel: true
    }
  },

  get recordsPerPage() {
    return config.pagination.dashboardReposPerPage;
  },

  model(params) {
    const offset = (params.page - 1) * this.recordsPerPage;
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
        limit: this.recordsPerPage,
        noInclude: true,
        representation: 'minimal_with_build',
      }, {
        filter: (repo) => repo.get('active') && repo.get('isCurrentUserACollaborator'),
        sort: dashboardRepositoriesSort,
        dependencies: ['active', 'isCurrentUserACollaborator'],
        forceReload: true
      }),
      accounts: this.accounts.fetch()
    });
  },

  afterModel(model) {
    const { repos } = model;
    const currentBuilds = repos.mapBy('currentBuild');
    const defaultBranches = repos.mapBy('defaultBranch');

    // This preloads related models to prevent a backtracking rerender error.
    return { currentBuilds, defaultBranches };
  }
});
