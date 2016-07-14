import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  build: belongsTo('build'),
  committer: belongsTo('user'),
  job: belongsTo('job')
});
