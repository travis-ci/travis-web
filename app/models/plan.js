import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  privateCredits: attr('number'),
  publicCredits: attr('number'),
  builds: attr('number'),
  annual: attr('boolean'),
  users: attr('number'),
  price: attr('number'),
  name: attr('string'),
  currency: attr('string'),
  isEnabled: attr('boolean'),
  isDefault: attr('boolean'),
  isAnnual: attr('boolean'),
  isFree: equal('price', 0),
  price_annual: attr('number'),
});
