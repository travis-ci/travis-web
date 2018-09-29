import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { alias } from 'ember-decorators/object/computed';

export default Controller.extend({
  @alias('model') build: null,

  buildStagesSort: ['number'],
  sortedBuildStages: sort('build.stages', 'buildStagesSort')
});
