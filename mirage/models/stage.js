import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  jobs: hasMany('job'),
  build: belongsTo('build'),
});
