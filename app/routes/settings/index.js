import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  titleToken: 'Settings',

  model() {
    var repo;
    repo = this.modelFor('repo');
    return repo.fetchSettings().then(function(settings) {
      return repo.set('settings', settings);
    });
  }
});
