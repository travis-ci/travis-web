import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';
import fetchAll from 'travis/utils/fetch-all';

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
