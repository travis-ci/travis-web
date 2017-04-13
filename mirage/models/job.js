import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  commit: belongsTo(),
  build: belongsTo(),
  branch: belongsTo(),
  repository: belongsTo('repository')
});
