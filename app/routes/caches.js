import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service ajax: service(),

  needsAuth: true,

  setupController(/* controller*/) {
    this._super(...arguments);
    return this.controllerFor('repo').activate('caches');
  },

  model() {
    var repo;
    repo = this.modelFor('repo');
    return this.get('ajax').get('/repos/' + (repo.get('id')) + '/caches').then(function (data) {
      var branch, cache, caches, pullRequests, pushes;
      caches = {};
      data['caches'].forEach(function (cacheData) {
        var branch, cache;
        branch = cacheData.branch;
        cache = caches[branch];
        if (cache) {
          cache.size += cacheData.size;
          if (cache.last_modified < cacheData.last_modified) {
            return cache.last_modified = cacheData.last_modified;
          }
        } else {
          return caches[branch] = cacheData;
        }
      });
      pushes = [];
      pullRequests = [];
      for (branch in caches) {
        cache = caches[branch];
        if (/PR./.test(branch)) {
          cache.type = 'pull_request';
          pullRequests.push(cache);
        } else {
          cache.type = 'push';
          pushes.push(cache);
        }
      }
      return {
        repo,
        pushes,
        pullRequests,
      };
    });
  },
});
