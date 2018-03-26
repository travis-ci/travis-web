import TravisRoute from 'travis/routes/basic';
import { fetch, Headers } from 'fetch';
import { hash } from 'rsvp';
import { service } from 'ember-decorators/service';
import config from 'travis/config/environment';

export default TravisRoute.extend({
  model() {
    // FIXME this ignores errors from either endpoint
    return hash({
      // FIXME is this an acceptable way to query the singleton endpoint?
      user: this.store.queryRecord('user', { current: true }),
      orgs: this.store.paginated('organization', {}, { live: false })
    }).then(({user, orgs}) => [user].concat(orgs.toArray()));
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
