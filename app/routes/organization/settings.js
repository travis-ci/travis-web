import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  features: service(),
  router: service(),
  store: service(),

  beforeModel() {
    if (!this.get('features.proVersion')) {
      this.router.transitionTo('organization.repositories', this.modelFor('organization'));
    }
  },

  model() {
    const organization = this.modelFor('organization');
    return this.store.query('preference', { organization_id: organization.id })
      .then(preferences => hash({ organization, preferences })).catch(error => {
        console.error('Error fetching preferences:', error);
      });
  }
});
