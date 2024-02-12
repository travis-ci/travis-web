import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  lastBuild: belongsTo('build', { inverse: null }),
  builds: hasMany('build'),
  repository: belongsTo('repository', { inverseOf: 'defaultBranch' })
});
