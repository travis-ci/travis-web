import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  lastBuild: belongsTo('build', { inverse: null }),
  builds: hasMany('build'),
  repository: belongsTo('repository', { inverseOf: 'defaultBranch' })
});
