import MainTabRoute from 'travis/routes/main-tab';

export default MainTabRoute.extend({
  renderTemplate() {
    this.render('repo');
    return this.render('build', {
      into: 'repo'
    });
  },

  setupController(controller, searchPhrase) {
    this.controllerFor('repo').activate('index');
    this.controllerFor('repos').activate('search', searchPhrase);
    return this.setCurrentRepoObservers();
  },

  model(params) {
    return params.phrase.replace(/%2F/g, '/');
  },

  deactivate() {
    this._super(...arguments);
    return this.controllerFor('repos').set('search', void 0);
  }
});
