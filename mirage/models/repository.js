import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  builds: hasMany('build'),
  envVars: hasMany(),
  settings: hasMany(),

  customSshKey: hasMany('ssh-key'),
  defaultSshKey: hasMany('ssh-key')
});
