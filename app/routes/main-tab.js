import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    this.render('repo');
    return this.render('build', {
      into: 'repo'
    });
  },

  setupController() {
    this._super(...arguments);
    this.controllerFor('repo').activate('index');
    this.controllerFor('repos').activate(this.get('reposTabName'));
    return this.setCurrentRepoObservers();
  },

  deactivate() {
    var repos;
    if (repos = this.controllerFor('repos')) {
      repos.removeObserver('repos.firstObject', this, 'currentRepoDidChange');
    }
    return this._super(...arguments);
  },

  currentRepoDidChange() {
    var repo;
    if (repo = this.controllerFor('repos').get('repos.firstObject')) {
      return this.controllerFor('repo').set('repo', repo);
    }
  },

  setCurrentRepoObservers() {
    var repos;
    this.currentRepoDidChange();
    if (repos = this.controllerFor('repos')) {
      return repos.addObserver('repos.firstObject', this, 'currentRepoDidChange');
    }
  },

  actions: {
    redirectToGettingStarted() {
      return this.transitionTo('getting_started');
    }
  }
});
