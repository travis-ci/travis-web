import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  commit: belongsTo(),
  build: belongsTo(),
  repository: belongsTo('repository')
});
