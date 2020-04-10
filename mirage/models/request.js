import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  repository: belongsTo(),
  build: belongsTo('build'),
  commit: belongsTo()
});
