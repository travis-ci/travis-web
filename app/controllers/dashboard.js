import Controller from '@ember/controller';
import { task, taskGroup } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default Controller.extend({
  flashes: service(),
  api: service(),

  repos: reads('model.items'),
  starredRepos: reads('model.filtered'),

  starring: taskGroup().drop(),

  star: task(function* (repo) {
    repo.set('starred', true);
    try {
      yield this.api.post(`/repo/${repo.get('id')}/star`);
    } catch (e) {
      repo.set('starred', false);
      this.flashes
        .error(`Something went wrong while trying to star  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  unstar: task(function* (repo) {
    repo.set('starred', false);
    try {
      yield this.api.post(`/repo/${repo.get('id')}/unstar`);
    } catch (e) {
      repo.set('starred', true);
      this.flashes
        .error(`Something went wrong while trying to unstar  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  // starredRepos: computed(
  //   'model.items.[]',
  //   'model.items.@each.currentBuildState',
  //   'model.items.@each.currentBuildFinishedAt',
  //   function () {
  //     const repositories = this.get('model.items');
  //     return repositories && repositories.toArray().sort(dashboardRepositoriesSort);
  //   }
  // )
});
