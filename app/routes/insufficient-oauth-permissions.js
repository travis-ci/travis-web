import SimpleLayoutRoute from 'travis/routes/simple-layout';

export default SimpleLayoutRoute.extend({
  setupController(controller) {
    var existingUser;

    this._super(...arguments);
    existingUser = document.location.hash.match(/#existing[_-]user/);
    return controller.set('existingUser', existingUser);
  }
});
