import TravisRoute from 'travis/routes/basic';
import { task } from 'ember-concurrency';

const mixins = [];

export default TravisRoute.extend(...mixins, {
  setupController() {
    this.controllerFor('repo').activate(this.get('contentType'));
    this.get('fetchBuildsTask').perform();
    this.controllerFor('build').set('contentType', this.get('contentType'));
  },

  titleToken() {
    return 'Builds';
  },

  path: 'repo.builds',

  contentType: 'builds',

  fetchBuildsTask: task(function* () {
    const model = yield this.modelFor('repo').get('builds');
    this.set('controller.model', model);
  }),
});
