import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  build: belongsTo('build'),
  job: belongsTo('job')
});
