import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  store: service(),

  model() {
    return hash({
      account: this.modelFor('account'),
      plans: this.get('store').findAll('plan'),
    });
  }
});
