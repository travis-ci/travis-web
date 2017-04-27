import TravisRoute from 'travis/routes/basic';
import StateInitializationMixin from 'travis/mixins/builds/state-initialization';

const mixins = [
  StateInitializationMixin,
];

export default TravisRoute.extend(...mixins, {
  titleToken() {
    return 'Pull Requests';
  },

  path: 'repo.pullRequests',

  contentType: 'pull_requests',
});
