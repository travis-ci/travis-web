import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  model() {
    const organization = this.modelFor('organization');
    // let orgPrefs = organization.store.findAll('preference');
    return hash({ organization });
  },
});
