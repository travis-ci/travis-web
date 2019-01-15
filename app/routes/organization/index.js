import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  redirect() {
    const organization = this.modelFor('organization');
    this.transitionTo('organization.repositories', organization);
  }
});
