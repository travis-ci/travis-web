import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo('repository'),
  commit: belongsTo(),
  jobs: hasMany()
});
