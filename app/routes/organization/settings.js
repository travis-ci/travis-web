import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    this.transitionTo('organization.repositories', this.modelFor('organization'));
  }
});
