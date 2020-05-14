import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  needsAuth: true,

  features: service(),
  accounts: service(),

  model(params) {
    return hash({
      starredRepos: this.store.filter('repo', {
        active: true,
        sort_by: 'current_build:desc',
        starred: true,
      }, (repo) => repo.starred && repo.active, ['starred', 'active'], true),
    });
  },
});
