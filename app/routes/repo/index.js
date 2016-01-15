import TravisRoute from 'travis/routes/basic';
import Config from 'travis/config/environment';

export default TravisRoute.extend({
  setupController(controller, model) {
    this._super.apply(this, arguments);
    return this.controllerFor('repo').activate('current');
  },

  renderTemplate() {
    return this.render('build');
  },
  deactivate() {
    var repo;
    repo = this.controllerFor('repo');
    this.controllerFor('build').set('build', null);
    this.controllerFor('job').set('job', null);
    return this._super.apply(this, arguments);
  }
});
