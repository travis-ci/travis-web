import Controller from '@ember/controller';
import { alias } from 'ember-decorators/object/computed';
import { service } from 'ember-decorators/service';

export default Controller.extend({
  @service('repositories') repositories: null,

  @alias('repositories.accessible.firstObject.currentBuild') currentBuild: null,
  @alias('model') build: null,
});
