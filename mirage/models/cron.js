import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  branch: belongsTo('branch'),
  repository: belongsTo('repository'),
});
