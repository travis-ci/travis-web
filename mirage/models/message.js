import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  request: belongsTo('request')
});
