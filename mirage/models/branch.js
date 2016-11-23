import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  builds: hasMany('build', { inverseOf: 'branch' }),
  repository: belongsTo('repository'),
});
