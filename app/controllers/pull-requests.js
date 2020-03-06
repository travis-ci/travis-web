import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  repoController: controller('repo'),

  repo: reads('repoController.repo'),
  tab: reads('repoController.tab'),

  liveBuilds: service(),

  pullRequests: reads('model'),

  livePullRequests: computed('repo.id', 'liveBuilds.pullRequests.[]', function () {
    const { repo, liveBuilds } = this;
    return !repo.id ? [] : liveBuilds.pullRequests.filterBy('repo.id', repo.id);
  }),
});
