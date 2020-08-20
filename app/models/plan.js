import Model, { attr } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  starting_price: attr(),
  starting_users: attr()
});
