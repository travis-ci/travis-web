import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  model() {
    return this.store.query('account', {
      all: true
    });
  },

  setupController(controller, model) {
    var orgs, user;
    user = model.filterBy('type', 'user')[0];
    orgs = model.filterBy('type', 'organization');
    controller.set('user', user);
    controller.set('organizations', orgs);
    return controller.set('model', model);
  },

  renderTemplate() {
    this._super(...arguments);
    return this.render('profile_accounts', {
      outlet: 'left',
      into: 'profile'
    });
  }
});
