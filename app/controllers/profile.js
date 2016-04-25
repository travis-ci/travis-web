import Ember from 'ember';

const { controller } = Ember.inject;

export default Ember.Controller.extend({
  name: 'profile',
  accountController: controller('account'),
  accountsController: controller('accounts'),
  userBinding: 'auth.currentUser',
  accountBinding: 'accountController.model',

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
