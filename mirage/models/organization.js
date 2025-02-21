import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  allowance: belongsTo(),
  installation: belongsTo(),
  subscription: belongsTo(),
  envVars: hasMany(),
});
