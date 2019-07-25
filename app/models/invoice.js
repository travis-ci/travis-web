import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  createdAt: attr('date'),
  url: attr('string'),
  amountDue: attr('number'),

  subscription: belongsTo('subscription')
});
