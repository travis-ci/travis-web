import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  lastBuild: belongsTo('build'),
  builds: hasMany('build'),
  repository: belongsTo('repository', { inverseOf: 'defaultBranch' })
});
