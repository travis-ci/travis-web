import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  builds: attr(),
  price: attr(),
  annual: attr('boolean'),
  currency: attr(),
});
