import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import { merge } from '@ember/polyfills';

// Adapted from services:job-state
let fetchAll = function (store, type, query) {
  return store.query(type, query).then((collection) => {
    let nextPage = collection.get('meta.pagination.next');
    if (nextPage) {
      let { limit, offset } = nextPage;
      return fetchAll(store, type, merge(query, { limit, offset }));
    }
  });
};

export default TravisRoute.extend({
  model() {
    return hash({
      // FIXME is this an acceptable way to query the singleton endpoint?
      user: this.store.queryRecord('user', { current: true }),
      orgs: this.store.filter('organization', () => true)
    }).then(
      ({user, orgs}) => fetchAll(this.store, 'organization', {}).then(
        () => [user].concat(orgs.toArray())));
  },

  setupController(controller, model) {
    let orgs, user;
    user = model.filterBy('type', 'user')[0];
    orgs = model.filterBy('type', 'organization');
    controller.set('user', user);
    controller.set('organizations', orgs);
    return controller.set('model', model);
  },
});
