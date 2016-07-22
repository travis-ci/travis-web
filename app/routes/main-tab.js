import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    this.render('repo');
    this.render('build', {
      into: 'repo'
    });
    this.render('job-log', { into: 'build', controller: 'job' });
  },

  setupController() {
    this._super(...arguments);
    this.controllerFor('repo').activate('index');
    this.controllerFor('repos').activate(this.get('reposTabName'));
    return this.setCurrentRepoObservers();
  },

  deactivate() {
    let repos = this.controllerFor('repos');
    if (repos) {
      repos.removeObserver('repos.firstObject', this, 'currentRepoDidChange');
    }
    return this._super(...arguments);
  },

  currentRepoDidChange() {
    let repo = this.controllerFor('repos').get('repos.firstObject');
    if (repo) {
      return this.controllerFor('repo').set('repo', repo);
    }
  },

  setCurrentRepoObservers() {
    this.currentRepoDidChange();
    let repos = this.controllerFor('repos');
    if (repos) {
      return repos.addObserver('repos.firstObject', this, 'currentRepoDidChange');
    }
  },

  actions: {
    redirectToGettingStarted() {
      return this.transitionTo('getting_started');
    }
  }
});
