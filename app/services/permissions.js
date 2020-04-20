import Service, { inject as service } from '@ember/service';
import { alias, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Service.extend({
  auth: service(),
  api: service(),

  currentUser: alias('auth.currentUser'),

  permissions: reads('fetchPermissions.lastSuccessful.value'),

  all: reads('permissions.permissions'),
  admin: reads('permissions.admin'),
  pull: reads('permissions.pull'),
  push: reads('permissions.push'),

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
  },

  fetchPermissions: task(function* () {
    return yield this.api.get('/users/permissions', { travisApiVersion: null });
  }).drop()
});
