import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  isLoading: false,

  @computed('model')
  repos(data) {
    let repos;
    repos = [];
    if (data.repositories) {
      repos = data.repositories
        .filterBy('active')
        .sortBy('default_branch.last_build.finished_at')
        .reverse();
    }
    return repos;
  },
});
