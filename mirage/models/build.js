import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo('commit', { inverseOf: 'build' }),
  branch: belongsTo('branch'),
  jobs: hasMany('job'),
  stages: hasMany('stage'),
  request: belongsTo('request')
});
