import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo('commit', { inverseOf: 'build' }),
  branch: belongsTo('branch', { inverseOf: 'builds' }),
  jobs: hasMany('job'),
  stages: hasMany('stage'),
});
