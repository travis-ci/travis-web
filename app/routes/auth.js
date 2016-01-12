import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  needsAuth: false,

  renderTemplate() {
    $('body').attr('id', 'auth');
    return this.render('signin');
  },

  deactivate() {
    return this.controllerFor('auth').set('redirected', false);
  },

  actions: {
    afterSignIn() {
      this.transitionTo('main');
      return true;
    }
  },

  redirect() {
    if (this.signedIn()) {
      return this.transitionTo('main');
    }
  }
});
