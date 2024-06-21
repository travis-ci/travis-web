import { Model, belongsTo, hasMany } from 'miragejs';

export default Model.extend({
  jobs: hasMany('job'),
  build: belongsTo('build'),
});
