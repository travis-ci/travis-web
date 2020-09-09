import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  privateCredits: attr('number'),
  publicCredits: attr('number'),
  users: attr('number'),
  price: attr('number'),
  name: attr('string'),
  currency: attr('string'),
  isEnabled: attr('boolean'),
  isDefault: attr('boolean'),
  isFree: equal('price', 0),
});
