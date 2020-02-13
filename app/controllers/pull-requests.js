import { sort, reads } from '@ember/object/computed';
import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  repoController: controller('repo'),

  buildsSorting: ['number:desc'],
  buildsValue: reads('model.lastSuccessful.value'),
  builds: sort('buildsValue', 'buildsSorting'),

  repo: reads('repoController.repo'),
  tab: reads('repoController.tab'),

  loaderModelName: 'build',
  loaderOptions: computed('model.id', function () {
    const { id } = this.model;
    return {
      event_type: 'pull_request',
      repository_id: id,
    };
  }),
});
