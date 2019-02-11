import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions.admin !== true) {
      this.transitionTo('organization.repositories', organization);
    }
    return hash({ organization });
  },
});
