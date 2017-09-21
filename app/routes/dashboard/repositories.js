import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    },
    offset: {
      refreshModel: true
    }
  },

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('index');
    }
  },

  model(params) {
    return Ember.RSVP.hash({
      starredRepos: this.store.filter('repo', {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      }, (repo) => repo.get('starred'), ['starred'], true),
      repos: this.store.paginated('repo', {
        active: true,
        sort_by: 'current_build:desc',
        offset: params.offset
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
    return Ember.RSVP.hash({
      currentBuilds: repos.map(repo => repo.get('currentBuild')),
      defaultBranches: repos.map(repo => repo.get('defaultBranch'))
    });
  }
});
