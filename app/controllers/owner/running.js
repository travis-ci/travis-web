import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  isLoading: false,

  @computed('model')
  running(data) {
    let repos;
    repos = data.repositories.filter((repo) => {
      const { currentBuild } = repo;
      return currentBuild !== null && currentBuild.state === 'started';
    });
    return repos;
  },
});
