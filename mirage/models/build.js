import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo('commit', { inverseOf: 'build' }),
  jobs: hasMany('job'),
  branch: belongsTo('branch', { inverseOf: 'lastBuild' }),
});
