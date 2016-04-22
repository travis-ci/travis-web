import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  titleToken: 'Profile',
  needsAuth: true,

  setupController(controller, model) {
    return this.controllerFor('accounts').set('model', model);
  },

  renderTemplate() {
    $('body').attr('id', 'profile');
    this._super(...arguments);

    return this.render('loading', {
      outlet: 'left',
      into: 'profile'
    });
  }
});
