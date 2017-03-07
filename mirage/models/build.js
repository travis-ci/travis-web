import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo('commit'),
  jobs: hasMany('job'),
  branches: hasMany('branch', { inverseOf: 'branch' })
});
