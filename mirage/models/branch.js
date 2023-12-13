import { hasMany, belongsTo } from 'miragejs';
import { Model } from 'miragejs';

export default Model.extend({
  lastBuild: belongsTo('build', { inverse: null }),
  builds: hasMany('build'),
  repository: belongsTo('repository', { inverseOf: 'defaultBranch' })
});
