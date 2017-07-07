import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),

  init() {
    this.get('all');
    return this._super(...arguments);
  },

  currentUser: Ember.computed.alias('auth.currentUser'),

  // This is computed property that can be used to allow any properties that
  // use permissions service to add dependencies easier. So instead of depending
  // on each of these things separately, we can depend on all
  all: Ember.computed('currentUser.permissions', 'currentUser.permissions.[]',
         'currentUser.pushPermissions', 'currentUser.pushPermissions.[]',
         // eslint-disable-next-line
         'currentUser.adminPermissions', 'currentUser.adminPermissions.[]', function () {
           return null;
         }),

  hasPermission(repo) {
    return this.checkPermission(repo, 'permissions');
  },

  hasPushPermission(repo) {
    return this.checkPermission(repo, 'pushPermissions');
  },

  hasAdminPermission(repo) {
    return this.checkPermission(repo, 'adminPermissions');
  },

  checkPermission(repo, permissionsType) {
    let id = isNaN(repo) ? repo.get('id') : repo;
    let currentUser = this.get('currentUser');
    if (currentUser) {
      return currentUser.get(permissionsType).includes(parseInt(id));
    } else {
      return false;
    }
  }
});
