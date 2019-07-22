import Model, { attr } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  builds: attr(),
  price: attr(),
  annual: attr('boolean'),
  currency: attr(),

  monthlyPrice: computed('annual', 'price', function () {
    const { annual, price } = this;
    return annual ? (price / 12) : price;
  }),
});
