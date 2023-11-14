import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  subscription: belongsTo('v2-subscription')
});
