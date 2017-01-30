import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  branches: hasMany(),
  builds: hasMany('build'),
  envVars: hasMany(),
  settings: hasMany(),
  caches: hasMany(),
});
