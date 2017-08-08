import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Settings',

  model() {
    const repo = this.modelFor('repo');
    return repo
      .fetchSettings()
      .then(settings => repo.set('settings', settings));
  }
});
