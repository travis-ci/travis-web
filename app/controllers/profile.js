import Ember from 'ember';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  name: 'profile',
  auth: service(),
  accountController: controller('account'),

  user: alias('auth.currentUser'),
  account: alias('accountController.model'),

  activate(action) {
    return this[('view_' + action).camelize()]();
  },

  viewHooks() {
    return this.get('accountController').reloadHooks();
  }
});
