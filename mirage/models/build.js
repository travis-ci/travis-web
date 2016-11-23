import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo('commit'),
  branch: belongsTo('branch', { inverseOf: 'builds' }),
  jobs: hasMany('job')
});
