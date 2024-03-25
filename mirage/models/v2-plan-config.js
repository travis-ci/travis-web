import { Model, hasMany } from 'miragejs';

export default Model.extend({
  subscriptions: hasMany('v2-subscription'),
});
