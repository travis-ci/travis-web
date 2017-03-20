import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  branch: belongsTo('branch'),
  repository: belongsTo('repository')
});
