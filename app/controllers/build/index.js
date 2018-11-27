import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @service repositories: null,

  @alias('repositories.accessible.firstObject.currentBuild') latestCurrentBuild: null,

  @computed('model', 'latestCurrentBuild')
  build(model, latestCurrentBuild) {
    if (model) {
      return model;
    } else {
      return latestCurrentBuild;
    }
  },
});
