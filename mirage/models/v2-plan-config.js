import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  subscriptions: hasMany('v2-subscription')
});
