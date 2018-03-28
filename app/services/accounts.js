import Service from '@ember/service';

import { service } from 'ember-decorators/service';
import { hash } from 'rsvp';
import fetchAll from 'travis/utils/fetch-all';

export default Service.extend({
  @service store: null,

  fetch() {
    return hash({
      // FIXME is this an acceptable way to query the singleton endpoint?
      user: this.get('store').queryRecord('user', { current: true }),
      orgs: this.get('store').filter('organization', () => true)
    }).then(
      ({user, orgs}) => fetchAll(this.get('store'), 'organization', {}).then(
        () => [user].concat(orgs.toArray())));
  }
});
