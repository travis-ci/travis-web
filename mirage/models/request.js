import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  repository: belongsTo(),
  builds: hasMany('build'),
  commit: belongsTo()
});
