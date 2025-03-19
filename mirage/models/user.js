import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  allowance: belongsTo(),
  installation: belongsTo('installation', { embed: true, inverse: 'owner' }),
  envVars: hasMany(),
  settings: hasMany(),
});
