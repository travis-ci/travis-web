import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  lastDigits: attr(),

  subscription: belongsTo('subscription'),
  token: attr(),
});
