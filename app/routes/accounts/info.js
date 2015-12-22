import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  setupController() {
    var user;
    user = this.controllerFor('currentUser').get('model');
    this.controllerFor('account').set('model', user);
    return this.controllerFor('profile').activate('user');
  },

  renderTemplate() {
    return this.render('accounts_info');
  }
});
