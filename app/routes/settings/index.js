import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Settings',

  model() {
    var repo;
    repo = this.modelFor('repo');
    return repo.fetchSettings().then(function (settings) {
      return repo.set('settings', settings);
    });
  }
});
