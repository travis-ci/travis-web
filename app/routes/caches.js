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
    const repo = this.modelFor('repo');
    const url = `/repo/${repo.get('id')}/caches`;
    return this.get('ajax').getV3(url).then((data) => data['caches'].reduce((model, cache) => {
      let branch = cache.branch;
      if (/PR./.test(branch)) {
        cache.type = 'pull_request';
        model.pullRequests.push(cache);
      } else {
        cache.type = 'push';
        model.pushes.push(cache);
      }

      return model;
    }, {
      repo,
      pushes: [],
      pullRequests: []
    }));
  },
});
