import Route from '@ember/routing/route';

export default Route.extend({

  beforeModel() {
    const org = this.modelFor('organization');
    return this.transitionTo('organization.migrate.webhooks', org);
  }

});
