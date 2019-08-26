import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  builds: attr(),
  price: attr(),
  annual: attr('boolean'),
  currency: attr(),
});
