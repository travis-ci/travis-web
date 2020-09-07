import Model, { attr } from '@ember-data/model';
import { equal } from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  starting_price: attr(),
  starting_users: attr(),
  private_credits: attr(),
  public_credits: attr(),

  isFree: equal('starting_price', 0)
});
