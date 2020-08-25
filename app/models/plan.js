import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  starting_price: attr(),
  starting_users: attr(),
  // V1 plan
  builds: attr(),
  price: attr(),
  annual: attr('boolean'),
  currency: attr(),
});
