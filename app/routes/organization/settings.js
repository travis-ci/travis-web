import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  features: service(),

  beforeModel() {
    if (!this.get('features.proVersion')) {
      this.transitionTo('organization.repositories', this.modelFor('organization'));
    }
  },

  model() {
    const organization = this.modelFor('organization');
    if (organization.permissions.admin !== true) {
      this.transitionTo('organization.repositories', organization);
    }
    const preferences = this.store.query('preference', { organization_id: organization.id });
    return hash({ organization, preferences });
  },
});
