import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  model() {
    return this.store.query('account', {
      all: true
    });
  },

  setupController(controller, model) {
    let orgs, user;
    user = model.filterBy('type', 'user')[0];
    orgs = model.filterBy('type', 'organization');
    controller.set('user', user);
    controller.set('organizations', orgs);
    return controller.set('model', model);
  },
});
