import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Service.extend({
  @service auth: null,

  init() {
    this.get('all');
    return this._super(...arguments);
  },

  @alias('auth.currentUser') currentUser: null,

  // This is computed property that can be used to allow any properties that
  // use permissions service to add dependencies easier. So instead of depending
  // on each of these things separately, we can depend on all
  @computed('currentUser.permissions.[]',
            'currentUser.pushPermissions.[]',
            'currentUser.adminPermissions.[]')
  all() {
    return null;
  },

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
