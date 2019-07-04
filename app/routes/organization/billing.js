import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  model() {
    return hash({
      account: this.modelFor('organization'),
      plans: this.store.findAll('plan'),
    });
  }
});
