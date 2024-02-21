import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  repositories: service(),

  latestCurrentBuild: alias('repositories.accessible.firstObject.currentBuild'),

  build: computed('model', 'latestCurrentBuild', function () {
    let model = this.model;
    let latestCurrentBuild = this.latestCurrentBuild;

    if (model) {
      return model;
    } else {
      return latestCurrentBuild;
    }
  })
});
