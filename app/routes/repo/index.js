import TravisRoute from 'travis/routes/basic';
import Config from 'travis/config/environment';

export default TravisRoute.extend({
  setupController(controller, model) {
    this._super.apply(this, arguments);
    return this.controllerFor('repo').activate('current');
  },

  renderTemplate() {
    if (this.modelFor('repo').get('lastBuildId')) {
      return this.render('build');
    } else {
      return this.render('builds/not_found');
    }
  },
  deactivate() {
    var repo;
    repo = this.controllerFor('repo');
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    return this._super.apply(this, arguments);
  }
});
