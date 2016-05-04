import Ember from 'ember';
import { hasPermission, hasPushPermission, hasAdminPermission } from 'travis/utils/permission';

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
         'currentUser.adminPermissions', 'currentUser.adminPermissions.[]',
         function() {
            return;
         }),

  hasPermission(repo) {
    return hasPermission(this.get('currentUser'), repo);
  },

  hasPushPermission(repo) {
    return hasPushPermission(this.get('currentUser'), repo);
  },

  hasAdminPermission(repo) {
    return hasAdminPermission(this.get('currentUser'), repo);
  }
});
