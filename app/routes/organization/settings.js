import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({

  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions.admin !== true) {
      this.transitionTo('organization.repositories', organization);
    }
    const preferences = this.store.query('preference', { organization_id: organization.id });
    return hash({ organization, preferences });
  },
});
