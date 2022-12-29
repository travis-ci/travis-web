import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  store: service(),
  auth: service(),

  repo: null,
  missingNotice: 'No log scans for this repository',

  init() {
    this.set('scanResults', null);
    return this._super(...arguments);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    assert('RepoBuildList requires @repo', !!this.repo);
  },

  user: alias('auth.currentUser'),

  userHasPushPermissionForRepo: computed('repo.id', 'user', 'user.pushPermissions.[]', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  }),
});
