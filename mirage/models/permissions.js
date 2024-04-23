import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  repository: belongsTo(),
  user: belongsTo(),
});
