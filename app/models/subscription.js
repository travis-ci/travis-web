import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  plan: belongsTo(),
  billingInfo: belongsTo({ async: false }),
  creditCardInfo: belongsTo({ async: false }),
  owner: belongsTo('owner', {polymorphic: true}),

  invoices: hasMany('invoice'),

  status: attr(),
  validTo: attr('date')
});
