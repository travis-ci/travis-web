import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  build: belongsTo(),
  committer: belongsTo('user'),
  job: belongsTo()
});
