import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  isLoading: false,

  running: computed('model', function () {
    let data = this.model;
    let repos;
    repos = data.repositories.filter((repo) => {
      const { currentBuild } = repo;
      return currentBuild !== null && currentBuild.state === 'started';
    });
    return repos;
  }),
});
