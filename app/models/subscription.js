import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  owner: belongsTo('owner', {polymorphic: true}),

  validTo: attr('date')
});
