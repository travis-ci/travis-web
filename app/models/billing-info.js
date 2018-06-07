import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  firstName: attr(),
  lastName: attr(),
  company: attr(),
  address: attr(),
  address2: attr(),
  city: attr(),
  state: attr(),
  zipCode: attr(),
  country: attr(),
  vatId: attr(),

  subscription: belongsTo(),
});
