import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Service.extend({
  auth: service(),

  init() {
    this.all;
    return this._super(...arguments);
  },

  currentUser: alias('auth.currentUser'),

  // This is computed property that can be used to allow any properties that
  // use permissions service to add dependencies easier. So instead of depending
  // on each of these things separately, we can depend on all
  all: computed(
    'currentUser.permissions.[]',
    'currentUser.pushPermissions.[]',
    'currentUser.adminPermissions.[]',
    () => null
  ),

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
    let currentUser = this.currentUser;
    if (currentUser) {
      return currentUser.get(permissionsType).includes(parseInt(id));
    } else {
      return false;
    }
  }
});
