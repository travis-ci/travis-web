import Ember from 'ember';

const { service, controller } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Controller.extend({
  name: 'profile',
  auth: service(),
  accountController: controller('account'),
  accountsController: controller('accounts'),

  user: alias('auth.currentUser'),
  account: alias('accountController.model'),

  activate(action, params) {
    return this[("view_" + action).camelize()]();
  },

  viewHooks() {
    this.connectTab('hooks');
    return this.get('accountController').reloadHooks();
  },

  viewUser() {
    return this.connectTab('user');
  },

  connectTab(tab) {
    return this.set('tab', tab);
  }
});
