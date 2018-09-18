import { hash } from 'rsvp';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  needsAuth: true,

  model(params) {
    return hash({
      starredRepos: this.store.filter('repo', {
        active: true,
        sort_by: 'current_build:desc',
        starred: true
      }, (repo) => repo.get('starred'), ['starred'], true),
    });
  },
});
