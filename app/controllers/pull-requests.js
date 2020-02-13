import { reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  repoController: controller('repo'),

  pullReqs: reads('model'),

  repo: reads('repoController.repo'),
  tab: reads('repoController.tab'),

  loaderModelName: 'build',
  loaderOptions: computed('repo.id', function () {
    const { id } = this.repo;
    return {
      event_type: 'pull_request',
      repository_id: id,
    };
  }),
});
