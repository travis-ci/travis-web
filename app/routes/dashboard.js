import TravisRoute from 'travis/routes/basic';
const { service } = Ember.inject;

export default TravisRoute.extend({
  needsAuth: true,
  starredRepos: service(),

  model() {
    return this.get('starredRepos').fetch();
  }
});
