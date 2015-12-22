import Ember from 'ember';

export default Ember.Controller.extend({
  name: 'profile',
  accountController: Ember.inject.controller('account'),
  accountsController: Ember.inject.controller('accounts'),
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
