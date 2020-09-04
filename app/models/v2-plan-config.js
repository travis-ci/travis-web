import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  starting_price: attr(),
  starting_users: attr(),
  private_credits: attr(),
  public_credits: attr(),

  isFree: computed('starting_price', function () {
    return this.starting_price === 0;
  })
});
