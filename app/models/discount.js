import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  percentOff: attr('number'),
  amountOff: attr('number'),
  valid: attr('boolean'),
  duration: attr('string'),
  durationInMonths: attr('number'),
  subscription: belongsTo('subscription')
});
