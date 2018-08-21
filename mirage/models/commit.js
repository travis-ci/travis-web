import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  build: belongsTo('build', { inverseOf: 'commit' }),
  job: belongsTo('job'),
  request: belongsTo()
});
