// FIXME this is entirely copied from dashboard/repositories

import Controller from '@ember/controller';
import { task, taskGroup } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import dashboardRepositoriesSort from 'travis/utils/dashboard-repositories-sort';

export default Controller.extend({
  @service flashes: null,
  @service api: null,

  starring: taskGroup().drop(),

  star: task(function* (repo) {
    repo.set('starred', true);
    try {
      yield this.get('api').post(`/repo/${repo.get('id')}/star`);
    } catch (e) {
      repo.set('starred', false);
      this.get('flashes')
        .error(`Something went wrong while trying to star  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  unstar: task(function* (repo) {
    repo.set('starred', false);
    try {
      yield this.get('api').post(`/repo/${repo.get('id')}/unstar`);
    } catch (e) {
      repo.set('starred', true);
      this.get('flashes')
        .error(`Something went wrong while trying to unstar  ${repo.get('slug')}.
               Please try again.`);
    }
  }).group('starring'),

  @computed('model.starredRepos.[]',
    'model.starredRepos.@each.currentBuildState',
    'model.starredRepos.@each.currentBuildFinishedAt')
  starredRepos(repositories) {
    return repositories.toArray().sort(dashboardRepositoriesSort);
  },
});
