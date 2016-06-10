import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  commits: hasMany('commit'),
  repository: belongsTo('repository'),
  builds: hasMany('build')
});
