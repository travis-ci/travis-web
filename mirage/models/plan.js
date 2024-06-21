import { Model, hasMany } from 'miragejs';

export default Model.extend({
  subscriptions: hasMany(),
});
