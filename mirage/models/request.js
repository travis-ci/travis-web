import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo(),
  builds: hasMany('build'),
  commit: belongsTo()
});
