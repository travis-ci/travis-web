import BasicRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import limit from 'travis/utils/computed-limit';

export default BasicRoute.extend({
  init: function() {
    var repos, store;

    store = this.store;
    repos = Ember.ArrayProxy.extend({
      isLoadedBinding: 'repos.isLoaded',
      repos: [],
      sorted: Ember.computed.sort('repos', 'sortedReposKeys'),
      content: limit('sorted', 'limit'),
      sortedReposKeys: ['sortOrderForLandingPage:desc'],
      limit: 3
    }).create();

    this.set('repos', repos);
    this.loadMoreRepos();

    return this._super.apply(this, arguments);
  },

  loadMoreRepos() {
    return this.store.findAll('build').then(() => {
      var repoIds, repos;
      repoIds = builds.mapBy('data.repo').uniq();
      repos = this.get('repos.repos');
      return this.store.query('repo', {
        ids: repoIds
      }).then(function(reposFromRequest) {
        return reposFromRequest.toArray().forEach(function(repo) {
          if (!repos.contains(repo)) {
            return repos.pushObject(repo);
          }
        });
      });
    });
  },

  activate() {
    var interval;
    this._super.apply(this, arguments);
    interval = setInterval(() => {
      return this.loadMoreRepos();
    }, 60000);
    this.set('interval', interval);
    return this.controllerFor('top').set('landingPage', true);
  },

  deactivate() {
    var interval;
    this._super.apply(this, arguments);
    if (interval = this.get('interval')) {
      clearInterval(interval);
    }
    return this.controllerFor('top').set('landingPage', false);
  },

  setupController(controller, model) {
    return controller.set('repos', this.get('repos'));
  }
});
