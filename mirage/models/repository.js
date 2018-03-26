import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  branches: hasMany(),
  builds: hasMany('build'),
  envVars: hasMany(),
  settings: hasMany(),
  caches: hasMany(),
  defaultBranch: belongsTo('branch', { inverse: null }),
  currentBuild: belongsTo('build', { inverse: null }),
  account: belongsTo(),
});
