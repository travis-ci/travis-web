import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  percentOff: attr('number'),
  amountOff: attr('number'),
  valid: attr('boolean'),
});
