import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  lastBuild: belongsTo('build'),
  builds: hasMany('build', { inverseOf: 'branch' }),
  repository: belongsTo('repository', { inverseOf: 'defaultBranch' })
});
