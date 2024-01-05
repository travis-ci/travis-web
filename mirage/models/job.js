import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  commit: belongsTo(),
  build: belongsTo(),
  repository: belongsTo('repository'),
  stage: belongsTo()
});
