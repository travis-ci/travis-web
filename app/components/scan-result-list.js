import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'travis/config/environment';
import dynamicQuery from 'travis/utils/dynamic-query';

const { repoBuildsPerPage: limit } = config.pagination;

export default Component.extend({
  store: service(),
  auth: service(),

  repo: null,
  missingNotice: 'No log scans for this repository',

  fetchScanResults({ page }) {
    const { repo, store } = this;
    const offset = (page - 1) * limit;
    const { id: repoId } = repo;

    return store.query('scan_result', {
      repository_id: repoId,
      limit, offset
    });
  },

  scanResultsLoader: dynamicQuery(function* ({ page = 1 }) {
    return yield this.fetchScanResults({ page });
  }, {
    limitPagination: true,
    limit,
  }),

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
